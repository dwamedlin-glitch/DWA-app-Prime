import React from "react";
import { useDWA } from "../DWAContext";
import { f, row, col, inp, btnGold } from "../styles/styleHelpers";
import { SkeletonList } from "../ui/LoadingSkeletons";

const TheFloor = () => {
  const {
    card, SectionIcon, darkMode,
    floorPosts, floorLoading, floorReplyTo, setFloorReplyTo,
    bannedUsers, floorPhoto, setFloorPhoto, floorPhotoPreview, setFloorPhotoPreview,
    floorPosting, floorPostRef, floorReplyRef, floorPhotoRef,
    isCurrentUserBanned, currentUserName, currentUid,
    isAdmin, isSteward, role,
    setConfirmModal, setToastMsg,
    handleFloorPost, handleFloorPhotoSelect, handleFloorReply,
    handleFloorDelete, handleBanUser, startFloorEdit,
  } = useDWA();

  const formatFloorTime = (ts) => {};
  const getInitials = (n) => {};
  const RoleBadge = ({role:r}) => null;
  const LocationTag = ({loc}) => null;
  return <div>TheFloor placeholder</div>;};export default TheFloor;
