"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/ui/custom/drawer-dialog";
import { ImageUpload } from "@/components/ui/custom/image-upload";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";


type UserCardProps = {
  src?: string;
  onChange: (src: string) => void;
}

export default function UserCard({ src, onChange }: UserCardProps) {


  return (
    <Card className=" px-12 py-10 tablet:min-w-[500px] shadow-md">
      <CardContent className=" px-0 flex items-stretch justify-normal gap-x-6">
        <Avatar className="size-24">
          <AvatarImage src={src} />
          <AvatarFallback>
            <Icons.User />
          </AvatarFallback>
        </Avatar>
        <div className=" space-y-2">
          <h1 className=" font-semibold">Profile Picture</h1>
          <div className=" text-gray-500 text-xs">
            We support PNGs, JPEGs under 10MB
          </div>
          <div className=" flex items-center justify-normal gap-x-3">
            <DrawerDialog
              trigger={<Button>Upload image</Button>}
              title='Upload image'
              description='Upload an image to be displayed on your profile.'
            >
              <ImageUpload  />
            </DrawerDialog>
            <Button size={"icon"} variant={"outline"}>
              <Icons.Trash size="1.4em" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className=" border-t pt-5 pb-0 flex items-center justify-end gap-x-3">
        <Button
          // onClick={() => }
          variant={"outline"}
        >
          Cancel
        </Button>
        <Button
        // onClick={handleUpdateUserData} disabled={!uploadedImagePath}
        >
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}