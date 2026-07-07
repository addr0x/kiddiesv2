"use client";

import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";

import { Field, FieldError, FieldLabel, FieldSeparator } from "@ui/field";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Spinner } from "@ui/spinner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/alert-dialog";

import { AlertCircleIcon, BadgeCheckIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import Link from "next/link";

interface IFormInput {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "";
  age: string;
  phone: string;
  whatsapp: string;
  picture: FileList | null;
  parentName: string;
  videoUrl?: string;
}

const perks = [
  { emoji: "🏆", text: "₦1,000,000 Grand Prize" },
  { emoji: "🎓", text: "3-Year Scholarship" },
  { emoji: "👑", text: "Future Star Title" },
  { emoji: "🌟", text: "Ages 0–8 Welcome" },
];

export default function RegistrationForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<boolean>(false);
  const [regError, setRegError] = useState<boolean>(false);
  const [contestant, setContestant] = useState<{
    name: string | null;
    id: string | null;
  }>({ name: null, id: null });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: { gender: "", age: "" },
  });

  const imageFile = watch("picture");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("gender", data.gender);
    formData.append("age", data.age);
    formData.append("parent", data.parentName);
    formData.append("phone", data.phone);
    formData.append("whatsapp", data.whatsapp);
    if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
    if (data.picture && data.picture.length > 0) {
      formData.append("picture", data.picture[0]);
    }

    try {
      const response = await fetch("/api/contestant", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200 && response.statusText === "OK") {
        const c = await response.json();
        setContestant({ ...c });
        setRegSuccess(true);
      } else {
        setRegError(true);
        throw new Error("Request failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-dvh grid lg:grid-cols-2 w-full">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-center bg-[#111] px-16 py-20 space-y-8">
          <span className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-xs px-4 py-1.5 rounded-full w-fit tracking-wider uppercase">
            ✨ The Future Star Challenge
          </span>
          <h1 className="font-bold text-white text-[clamp(2rem,4vw,3.5rem)] leading-tight">
            Give Your Child
            <br />a Chance to <span className="text-[#FACC14]">Shine!</span>
          </h1>
          <p className="text-gray-300 font-semibold leading-relaxed max-w-[40ch] text-sm">
            Register your child today and join Nigeria&apos;s most exciting kids
            contest. Campaign, gather votes, and win life-changing prizes!
          </p>
          <div className="space-y-3 pt-2">
            {perks.map((p) => (
              <div
                key={p.text}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">{p.emoji}</span>
                <span className="font-bold text-white text-sm">{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex items-start justify-center px-6 pt-28 pb-16 overflow-y-auto">
          <div className="w-full max-w-xl space-y-6">
            <div className="space-y-1">
              <h2 className="font-bold text-black text-[clamp(1.6rem,3vw,2.2rem)]">
                Registration Form
              </h2>
              <p className="text-gray-500 font-semibold text-sm">
                Fill out the form to enroll your child into{" "}
                <span className="text-black font-bold">
                  The Future Star Challenge
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="firstName"
                    className='max-w-fit relative after:absolute after:text-red-500 after:content-["*"] after:-right-2 font-bold text-black'>
                    First Name
                  </FieldLabel>
                  <Input
                    {...register("firstName", {
                      required: "First Name is required",
                      maxLength: 20,
                    })}
                    className="border-2 border-black rounded-xl focus-visible:ring-[#FACC14]"
                    placeholder="Jane"
                  />
                  <FieldError>{errors.firstName?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor="lastName"
                    className="font-bold text-black">
                    Last Name
                  </FieldLabel>
                  <Input
                    {...register("lastName", {
                      required: "Last Name is required",
                      maxLength: 20,
                    })}
                    className="border-2 border-black rounded-xl focus-visible:ring-[#FACC14]"
                    placeholder="Akintola"
                  />
                  <FieldError>{errors.lastName?.message}</FieldError>
                </Field>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="gender" className="font-bold text-black">
                    Gender
                  </FieldLabel>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Select a valid gender" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="border-2 border-black rounded-xl">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError>{errors.gender?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="age" className="font-bold text-black">
                    Age
                  </FieldLabel>
                  <Controller
                    name="age"
                    control={control}
                    rules={{ required: "Select a valid age" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger className="border-2 border-black rounded-xl">
                          <SelectValue placeholder="Select Age" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Less than 1 year</SelectItem>
                          <SelectItem value="1">1 year</SelectItem>
                          <SelectItem value="2">2 years</SelectItem>
                          <SelectItem value="3">3 years</SelectItem>
                          <SelectItem value="4">4 years</SelectItem>
                          <SelectItem value="5">5 years</SelectItem>
                          <SelectItem value="6">6 years</SelectItem>
                          <SelectItem value="7">7 years</SelectItem>
                          <SelectItem value="8">8 years</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError>{errors.age?.message}</FieldError>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="picture" className="font-bold text-black">
                  Upload a Picture
                </FieldLabel>
                <div className="flex gap-4">
                  <Input
                    className="h-18 border-2 border-black rounded-xl file:mr-4 file:rounded-lg file:border-0 file:bg-[#FACC14] file:px-4 file:text-sm file:font-bold file:text-black hover:file:bg-yellow-300"
                    id="picture"
                    type="file"
                    accept="image/*"
                    {...register("picture", {
                      required: "Picture is required",
                    })}
                  />
                  {preview && (
                    <Image
                      src={preview}
                      width={18}
                      height={18}
                      alt="Preview"
                      className="w-auto h-18 rounded-xl border-2 border-black"
                    />
                  )}
                </div>
                <FieldError>{errors.picture?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="videoUrl" className="font-bold text-black">
                  Video Link{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </FieldLabel>
                <Input
                  {...register("videoUrl", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                  })}
                  className="border-2 border-black rounded-xl"
                  placeholder="YouTube or TikTok link"
                />
                <FieldError>{errors.videoUrl?.message}</FieldError>
              </Field>

              <FieldSeparator className="my-2 border-black/10" />

              <Field>
                <FieldLabel
                  htmlFor="parentName"
                  className="font-bold text-black">
                  Parent&apos;s Full Name
                </FieldLabel>
                <Input
                  {...register("parentName", {
                    required: "Parent name is required",
                    maxLength: 70,
                  })}
                  className="border-2 border-black rounded-xl"
                  placeholder="Onyinyechi Akintola"
                />
                <FieldError>{errors.parentName?.message}</FieldError>
              </Field>

              <div className="grid lg:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="phone" className="font-bold text-black">
                    Phone Number
                  </FieldLabel>
                  <Input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^(?:(?:0|\+234)\s?)?[789]\d{9}$/,
                        message: "Invalid phone number format",
                      },
                    })}
                    className="border-2 border-black rounded-xl"
                    placeholder="+2348012345678"
                  />
                  <FieldError>{errors.phone?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor="whatsapp"
                    className="font-bold text-black">
                    WhatsApp Number
                  </FieldLabel>
                  <Input
                    {...register("whatsapp", {
                      required: "WhatsApp number is required",
                      pattern: {
                        value: /^(?:(?:0|\+234)\s?)?[789]\d{9}$/,
                        message: "Invalid WhatsApp number format",
                      },
                    })}
                    className="border-2 border-black rounded-xl"
                    placeholder="+2348012345678"
                  />
                  <FieldError>{errors.whatsapp?.message}</FieldError>
                </Field>
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 font-bold text-black bg-[#FACC14] border-2 border-black rounded-xl shadow-[4px_4px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition text-sm"
                  disabled={isSubmitting}>
                  {isSubmitting && <Spinner />}
                  {isSubmitting ? "Registering..." : "Register Now "}
                </Button>

                {regError && (
                  <Alert
                    variant="destructive"
                    className="border-2 border-red-500">
                    <AlertCircleIcon />
                    <AlertTitle>
                      Unable to process your registration.
                    </AlertTitle>
                    <AlertDescription>
                      <ul className="list-inside list-disc text-sm">
                        <li>Check your internet service</li>
                        <li>Try again</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <AlertDialog open={regSuccess}>
        <AlertDialogContent className="border-2 border-black shadow-[6px_6px_0px_#111]">
          <AlertDialogHeader>
            <BadgeCheckIcon className="size-10 fill-[#FACC14] stroke-black mx-auto" />
            <AlertDialogTitle className="font-bold text-center text-xl">
              Registration Successful! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Thank you for enrolling in{" "}
              <span className="font-bold text-black">
                The Future Star Challenge
              </span>
              . Our team will reach out to you shortly.
            </AlertDialogDescription>
            <AlertDialogDescription className="text-center font-bold text-black">
              {contestant.name}&apos;s Contestant ID:{" "}
              <span className="bg-[#FACC14] px-2 py-0.5 rounded font-black border border-black">
                {contestant.id}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link
                href="/"
                className="bg-black text-[#FACC14] font-bold px-6 py-2.5 rounded-xl border-2 border-black hover:bg-gray-900 transition">
                Back to Home
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
