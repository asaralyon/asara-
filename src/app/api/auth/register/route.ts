import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      profession,
      category,
      companyName,
      description,
      address,
      city,
      postalCode,
      professionalPhone,
      professionalEmail,
      website,
    } = body;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est deja utilise' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const passwordHash = await hash(password, 12);

    // Créer le slug pour le profil
    const baseSlug = `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, '-');
    let slug = baseSlug;
    let counter = 1;

    // Vérifier si le slug existe déjà
    while (await prisma.professionalProfile.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        role: role || 'MEMBER',
        status: 'PENDING',
        emailVerified: false,
      },
    });

    // Si professionnel, créer le profil
    if (role === 'PROFESSIONAL') {
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          profession,
          category,
          companyName: companyName || null,
          description: description || null,
          address: address || null,
          city,
          postalCode,
          professionalPhone: professionalPhone || null,
          professionalEmail: professionalEmail || null,
          website: website || null,
          slug,
          isPublished: false,
        },
      });
    }

    // Envoyer l'email de confirmation
    const template = emailTemplates.inscriptionPending(firstName, role || 'MEMBER');
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    });

    // Notifier l'admin
    await sendEmail({
      to: 'info@asara-lyon.fr',
      subject: `Nouvelle inscription - ${firstName} ${lastName}`,
      html: `
        <h2>Nouvelle inscription sur ASARA</h2>
        <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Type:</strong> ${role === 'PROFESSIONAL' ? 'Professionnel' : 'Membre'}</p>
        ${role === 'PROFESSIONAL' ? `<p><strong>Profession:</strong> ${profession}</p>` : ''}
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/utilisateurs">Voir dans l'admin</a></p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Inscription reussie',
      userId: user.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l inscription' },
      { status: 500 }
    );
  }
}