import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function GET(request: Request) {
  // Vérifier la clé secrète pour sécuriser l'endpoint
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  try {
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Trouver les abonnements qui expirent dans 30 jours
    const expiring30 = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: {
          gte: new Date(in30Days.getTime() - 24 * 60 * 60 * 1000),
          lte: in30Days,
        },
      },
      include: { user: true },
    });

    // Trouver les abonnements qui expirent dans 7 jours
    const expiring7 = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: {
          gte: new Date(in7Days.getTime() - 24 * 60 * 60 * 1000),
          lte: in7Days,
        },
      },
      include: { user: true },
    });

    // Trouver les abonnements expirés aujourd'hui
    const expired = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: {
          lte: now,
        },
      },
      include: { user: true },
    });

    let emailsSent = 0;

    // Envoyer les rappels 30 jours
    for (const sub of expiring30) {
      const amount = sub.type === 'PROFESSIONAL' ? '100 EUR' : '15 EUR';
      const template = emailTemplates.renewalReminder30(
        sub.user.firstName,
        sub.currentPeriodEnd.toLocaleDateString('fr-FR'),
        amount
      );
      await sendEmail({ to: sub.user.email, ...template });
      emailsSent++;
    }

    // Envoyer les rappels 7 jours
    for (const sub of expiring7) {
      const amount = sub.type === 'PROFESSIONAL' ? '100 EUR' : '15 EUR';
      const template = emailTemplates.renewalReminder7(
        sub.user.firstName,
        sub.currentPeriodEnd.toLocaleDateString('fr-FR'),
        amount
      );
      await sendEmail({ to: sub.user.email, ...template });
      emailsSent++;
    }

    // Marquer les abonnements expirés et envoyer les emails
    for (const sub of expired) {
      // Mettre à jour le statut
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'EXPIRED' },
      });

      await prisma.user.update({
        where: { id: sub.userId },
        data: { status: 'EXPIRED' },
      });

      // Masquer le profil si professionnel
      await prisma.professionalProfile.updateMany({
        where: { userId: sub.userId },
        data: { isPublished: false },
      });

      // Envoyer l'email
      const template = emailTemplates.subscriptionExpired(sub.user.firstName, sub.user.role);
      await sendEmail({ to: sub.user.email, ...template });
      emailsSent++;
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      details: {
        reminder30: expiring30.length,
        reminder7: expiring7.length,
        expired: expired.length,
      },
    });
  } catch (error) {
    console.error('CRON error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

