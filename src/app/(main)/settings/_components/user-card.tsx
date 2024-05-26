"use client";

import React, { useTransition } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/ui/custom/drawer-dialog";
import { ImageUpload } from "@/components/ui/custom/image-upload";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteUploadthingFiles } from "@/action/uploadthing";
import { toast } from "sonner";
import { extractFilename } from "@/lib/file";
import { Label } from "@/components/ui/label";


type UserCardProps = {
  src?: string;
  onChange: (src: string) => void;
}

export default function UserCard({ src, onChange }: UserCardProps) {

  const [imageSrc, setImageSrc] = React.useState(src);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [isPending, startTransition] = useTransition()
  const onDeleteFile = () => {
    const image = extractFilename(src);
    if (!image) {
      toast.warning("No image to delete");
      return;
    }
    startTransition(() => {
      toast.promise(deleteUploadthingFiles(image), {
        loading: "Deleting image...",
        success: () => {
          onChange("")
          setImageSrc("")
          return "Image deleted"
        },
        error: "Failed to delete image",
      });
    })

  }
  const onUploadCompleted = (src: string) => {
    setImageSrc(src);
    onChange(src);
    setDrawerOpen(false);
  }

  const onUsePreviousAvatar = () => {
    const image = extractFilename(imageSrc);

    image && deleteUploadthingFiles(image);
    if (!src) return;
    onChange(src);
    setImageSrc(src);
  }

  return (
    <Card className=" px-12 py-10 tablet:min-w-[500px] shadow-md">
      <CardContent className=" px-0 flex items-stretch justify-normal gap-x-6">
        <Avatar className="size-24">
          <AvatarImage src={imageSrc} />
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
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              trigger={<Button>Upload image</Button>}
              title='Upload image'
              description='Upload an image to be displayed on your profile.'
            >
              <ImageUpload onChange={onUploadCompleted} />
            </DrawerDialog>
            <Button onClick={onDeleteFile} disabled={isPending || !imageSrc} size={"icon"} variant={"outline"}>
              <Icons.Trash size="1.4em" />
            </Button>
          </div>
        </div>
      </CardContent>
      {
        imageSrc !== src && (
          <CardFooter className=" border-t pt-5 pb-0 pl-0  gap-x-3 justify-start items-center">
            <Label>
              Want to use your previous avatar? Click here
            </Label>
            <Avatar onClick={onUsePreviousAvatar} className="size-10 cursor-pointer">
              <AvatarImage className="shadow-sm" src={src} />
              <AvatarFallback>
                <Icons.User />
              </AvatarFallback>
            </Avatar>
          </CardFooter>
        )
      }
    </Card>
  );
}