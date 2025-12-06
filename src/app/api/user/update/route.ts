import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non connecte' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key');
    const { payload } = await jwtVerify(token, secret);

    const body = await request.json();
    const { firstName, lastName, phone, address, city, postalCode, profile } = body;

    const user = await prisma.user.update({
      where: { id: payload.userId as string },
      data: {
        firstName,
        lastName,
        phone,
        address,
        city,
        postalCode,
      },
    });

    if (profile) {
      await prisma.professionalProfile.update({
        where: { userId: user.id },
        data: {
          profession: profile.profession,
          companyName: profile.companyName,
          description: profile.description,
          address: profile.address,
          city: profile.city,
          postalCode: profile.postalCode,
          professionalPhone: profile.professionalPhone,
          professionalEmail: profile.professionalEmail,
          website: profile.website,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}