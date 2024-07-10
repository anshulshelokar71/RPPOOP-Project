import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/student/navbar";
// import FriendListWidget from "scenes/widgets/FriendListWidget";
// import MyPostWidget from "scenes/widgets/MyPostWidget";
// import PostsWidget from "scenes/widgets/PostsWidget";
import HostWidget from "scenes/widgets/HostsWidget";
import { BACKEND_URL } from "config";

const ProfilePageHost = () => {
  const [host, setHost] = useState(null);
  const { hostId } = useParams();
  const token = useSelector((state) => state.token1);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getHost = async () => {
    const response = await fetch(`${BACKEND_URL}/users/${hostId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setHost(data);
  };

  useEffect(() => {
    getHost();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!host) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <HostWidget hostId={hostId} picturePath={host.picturePath} />
          <Box m="2rem 0" />
          {/* <FriendListWidget userId={userId} /> */}
        </Box>
        {/* <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box> */}
      </Box>
    </Box>
  );
};

export default ProfilePageHost;
