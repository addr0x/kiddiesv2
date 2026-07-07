import { prisma } from "@/lib/prisma"
import { getContestConfig, stageVoteField } from "@/lib/contest-config"
import { isAdminSession } from "@/lib/admin-auth";
import { storeContestantImage } from "@/lib/image-upload";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"

const publicContestantSelect = {
  contestantId: true,
  firstName: true,
  lastName: true,
  stage1vote: true,
  stage2vote: true,
  stage3vote: true,
  gender: true,
  age: true,
  picture: true,
} satisfies Prisma.ContestantSelect;

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function imageUploadErrorResponse(error: unknown) {
  if (!(error instanceof Error)) return null;

  if (error.message === "INVALID_IMAGE_TYPE") {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, or WebP image." },
      { status: 400 },
    );
  }

  if (error.message === "IMAGE_TOO_LARGE") {
    return NextResponse.json(
      { error: "Image must be 5MB or smaller." },
      { status: 400 },
    );
  }

  if (error.message === "IMAGE_STORAGE_NOT_CONFIGURED") {
    return NextResponse.json(
      { error: "Image storage is not configured." },
      { status: 503 },
    );
  }

  if (error.message === "IMAGE_UPLOAD_FAILED") {
    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 502 },
    );
  }

  return null;
}

function fieldValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidName(value: string) {
  return /^[A-Za-z][A-Za-z\s'-]{0,49}$/.test(value);
}

function isValidPhone(value: string) {
  return /^\+?[0-9\s()-]{7,20}$/.test(value);
}

function isValidVideoUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateContestantRegistration({
  firstName,
  lastName,
  gender,
  age,
  parent,
  phone,
  whatsapp,
  picture,
  videoUrl,
}: {
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  parent: string;
  phone: string;
  whatsapp: string;
  picture: File | null;
  videoUrl: string;
}) {
  if (!firstName || !lastName || !gender || !age || !parent || !phone || !whatsapp || !picture) {
    return "Missing required fields";
  }

  if (!isValidName(firstName) || !isValidName(lastName) || !isValidName(parent)) {
    return "Names may only contain letters, spaces, apostrophes, and hyphens.";
  }

  if (gender !== "male" && gender !== "female") {
    return "Select a valid gender.";
  }

  const ageNumber = Number(age);
  if (!Number.isSafeInteger(ageNumber) || ageNumber < 0 || ageNumber > 8) {
    return "Age must be between 0 and 8.";
  }

  if (!isValidPhone(phone) || !isValidPhone(whatsapp)) {
    return "Enter a valid phone and WhatsApp number.";
  }

  if (!isValidVideoUrl(videoUrl)) {
    return "Video URL must be a valid URL.";
  }

  return null;
}

async function nextContestantId() {
  const existingCount = await prisma.contestant.count();

  try {
    const counter = await prisma.counter.upsert({
      where: { key: "contestant" },
      update: { value: { increment: 1 } },
      create: { key: "contestant", value: existingCount + 1 },
    });

    return String(counter.value).padStart(3, "0");
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const counter = await prisma.counter.update({
      where: { key: "contestant" },
      data: { value: { increment: 1 } },
    });

    return String(counter.value).padStart(3, "0");
  }
}

export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const ranking = searchParams.get("rank");

    let contestants;

    if (ranking === "top") {
      const config = await getContestConfig();
      const field = stageVoteField(config.currentStage);

      const raw = await prisma.contestant.findMany({
        where: { disabled: false },
        select: publicContestantSelect,
        orderBy: { [field]: "desc" },
        take: 5,
      });

      contestants = raw.map((c) => ({ ...c, currentVotes: c[field] }));
    } else {
      contestants = await prisma.contestant.findMany({
        where: { disabled: false },
        select: publicContestantSelect,
      })
    }

    return NextResponse.json(contestants);

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(`contestant-registration:${clientIp(request)}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (limited) return limited;

    const formData = await request.formData();

    const firstName = fieldValue(formData.get("firstName"));
    const lastName = fieldValue(formData.get("lastName"));
    const gender = fieldValue(formData.get("gender")).toLowerCase();
    const age = fieldValue(formData.get("age"));
    const parent = fieldValue(formData.get("parent"));
    const phone = fieldValue(formData.get("phone"));
    const whatsapp = fieldValue(formData.get("whatsapp"));
    const picture = formData.get("picture") as File | null;
    const videoUrl = fieldValue(formData.get("videoUrl"));

    const validationError = validateContestantRegistration({
      firstName,
      lastName,
      gender,
      age,
      parent,
      phone,
      whatsapp,
      picture,
      videoUrl,
    });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    let pictureUrl: string | null = null;

    if (picture) {
      pictureUrl = await storeContestantImage(picture, "contestants");
    }

    const nextId = await nextContestantId();

    const contestant = await prisma.contestant.create({
      data: {
        contestantId: nextId,
        firstName,
        lastName,
        gender,
        age,
        picture: pictureUrl,
        videoUrl: videoUrl || null,
        parent,
        phone,
        whatsapp
      }
    });

    return NextResponse.json({ name: `${contestant.firstName} ${contestant.lastName}`, id: contestant.contestantId });
  } catch (error) {
    const uploadResponse = imageUploadErrorResponse(error);
    if (uploadResponse) return uploadResponse;

    console.error("Error creating contestant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const contestantId = formData.get("contestantId") as string | null;
    const picture = formData.get("picture") as File | null;

    if (!contestantId || !picture) {
      return NextResponse.json(
        { error: "contestantId and picture are required" },
        { status: 400 }
      );
    }

    const pictureUrl = await storeContestantImage(picture, "contestants");

    const contestant = await prisma.contestant.update({
      where: {
        contestantId,
      },
      data: {
        picture: pictureUrl,
      },
    });

    return NextResponse.json({ contestant }, { status: 200 });
  } catch (error) {
    const uploadResponse = imageUploadErrorResponse(error);
    if (uploadResponse) return uploadResponse;

    console.error(error);

    return NextResponse.json(
      { error: "Failed to update contestant picture" },
      { status: 500 }
    );
  }
}


// export async function DELETE(request: NextRequest) {
//   try {
//     const result = await prisma.contestant.updateMany({
//       where: {
//         stage1vote: {
//           lt: 300,
//         },
//       },
//       data: {
//         disabled: true,
//       },
//     });
//     return NextResponse.json(result);


//   } catch (error) {
//     console.log(error)
//   }
// }
