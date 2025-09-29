"use client";
import React, { useEffect } from "react";
import MainContainer from "../ui/shared/containers/MainContainer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser, getProfileById } from "@/store/redusers/userReducer";
import { redirect, usePathname } from "next/navigation";
import DeleteDialog from "../ui/shared/dialog/DeleteDialog";
import P from "../ui/shared/text/P";
import ProfileSkeleton from "../ui/shared/skeletons/ProfileSkeleton";
import UserInfo from "../ui/blocks/profile/UserInfo";
import UserInfluence from "../ui/blocks/profile/UserInfluence";
import { isUserInterface } from "@/types/user";
import NotificationRequest from "../ui/blocks/notification/NotificationRequest";

export default function ProfileScreen() {
  const path = usePathname();
  const dispatch = useAppDispatch();

  const { user, profile, loading, error } = useAppSelector((state) => state.user);

  const segments = path.split("/");
  const profileId = segments[2];

  useEffect(() => {
    if (profileId) {
      dispatch(getProfileById(profileId));
    }
  }, [profileId, dispatch]);

  const handleExit = () => {
    dispatch(logoutUser());
    redirect("/");
  };

  const isOwnProfile = !profileId;
  const currentProfile = isOwnProfile ? user : profile;

  return (
    <MainContainer className='min-h-[100dvh]'>
      {error ? (
        <P variant={"error"}>{error.message}</P>
      ) : (
        <>
          <section className='flex flex-col justify-start items-start gap-4 lg:gap-10 lg:p-12 md:p-8 pb-4'>
            {loading ? (
              <ProfileSkeleton />
            ) : (
              <>
                <UserInfo user={currentProfile} />
                <NotificationRequest />
                {isOwnProfile && (
                  <DeleteDialog
                    handleAction={handleExit}
                    description='You will be logged out of your account.'
                  />
                )}
              </>
            )}
          </section>
          {isUserInterface(currentProfile) && <UserInfluence />}
        </>
      )}
    </MainContainer>
  );
}
