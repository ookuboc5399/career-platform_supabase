import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(context.params);

    const certificationResponse = await fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/certifications/${resolvedParams.id}`
    );
    if (!certificationResponse.ok) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    const certification = await certificationResponse.json();

    const questionsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/certifications/${resolvedParams.id}/questions`
    );
    if (!questionsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
    const questions = await questionsResponse.json();

    return NextResponse.json({
      ...certification,
      questions,
    });
  } catch (error) {
    console.error('Error fetching certification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certification' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const certificationId = context.params.id;

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const difficulty = formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced';
    const estimatedStudyTime = formData.get('estimatedStudyTime') as string;
    const imageFile = formData.get('image');

    const certResponse = await fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/certifications/${certificationId}`
    );
    if (!certResponse.ok) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    const certification = await certResponse.json();

    let imageUrl = certification.imageUrl;

    if (!imageFile && !imageUrl) {
      imageUrl = `/images/certification/${category}.svg`;
    }

    if (imageFile && imageFile instanceof Blob) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      uploadFormData.append('type', 'certification-image');

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/upload`,
        {
          method: 'POST',
          body: uploadFormData,
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload image: ${errorText}`);
      }

      const responseData = await uploadResponse.json();
      imageUrl = responseData.url;
    }

    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/certifications/${certificationId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          category,
          difficulty,
          estimatedStudyTime,
          imageUrl,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to update certification');
    }

    const updated = await updateResponse.json();
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating certification:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update certification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const certificationId = context.params.id;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/certifications/${certificationId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
      }
      throw new Error('Failed to delete certification');
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete certification' },
      { status: 500 }
    );
  }
}
