import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { deleteImage, uploadImage } from "../../redux/actions/talentActions";
import { Button, Typography } from "@material-ui/core";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { withRouter } from "react-router";
import LightboxModal from "components/shared/LightboxModal";
import MyDropzone from "components/shared/MyDropzone";
import { makeStyles } from "@material-ui/styles";
import styled from "styled-components";

const GET_USER = require("../../graphql/queries/user/GET_USER.graphql");
const SET_PROFILE = require("../../graphql/mutations/profile/SET_PROFILE.graphql");
const DELETE_IMAGE = require("../../graphql/mutations/profile/DELETE_IMAGE.graphql");

const useStyles = makeStyles({
  imageList: {
    height: 300,
    width: 300,
    "object-fit": "scale-down"
  }
});

const ProfileImageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const ProfileImagePage: FC<any> = props => {
  const classes = useStyles();
  const { readOnly, userId } = props;
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [getUser, { data, loading, refetch }] = useLazyQuery(GET_USER, {
    variables: { id: userId }
  });

  useEffect(() => {
    getUser();
  }, [userId, getUser]);

  const refetchQuery = {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { id: userId }
      }
    ]
  };
  const [setProfile] = useMutation(SET_PROFILE, refetchQuery);
  const [deleteImage] = useMutation(DELETE_IMAGE, refetchQuery);

  const user = data && data.getUser;

  if (!data || loading) {
    return <h1>loading</h1>;
  }
  if (user.profileImages.length > 4) {
    return (
      <div>
        <Typography variant={"h5"}>
          Free Accounts Currently Support A Maximum of 4 Images
        </Typography>
        <Typography variant={"body1"}>
          Unlimited Image Upload Available Soon
        </Typography>
      </div>
    );
  }
  return (
    <div>
      <LightboxModal
        open={open}
        handleClose={() => setOpen(false)}
        images={user.profileImages.map((p: any, i: number) => ({
          key: `${p.url}${i}`,
          src: p.url
        }))}
        currentIndex={currentIndex}
      />
      {!readOnly &&
        (user.profileImages.length >= 1 ? (
          <div>
            <Typography variant={"h5"}>
              Free Accounts Currently Support A Maximum of 1 Image
            </Typography>
            <Typography variant={"body1"}>
              Unlimited Image Upload Available Soon
            </Typography>
          </div>
        ) : (
          <MyDropzone {...props} refetch={refetch} />
        ))}
      <ProfileImageContainer>
        {user.profileImages &&
          user.profileImages.map((img: any, index: number) => (
            <div style={{padding: '1rem'}} key={`${index}${img.s3key}`}>
              <img
                className={classes.imageList}
                src={img.url}
                alt={user.displayName + index}
                onClick={() => {
                  setOpen(true);
                  setCurrentIndex(index);
                }}
              />
              {!readOnly && (
                <div>
                  {user.profilePicture &&
                  user.profilePicture.s3Key === img.s3Key ? (
                    <Button variant={"outlined"} color={"primary"} disabled>
                      Current Image
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        setProfile({ variables: { key: img.s3Key } })
                      }
                      variant={"outlined"}
                      color={"primary"}
                    >
                      Set Profile Image
                    </Button>
                  )}

                  <Button
                    onClick={() =>
                      deleteImage({ variables: { key: img.s3Key } })
                    }
                    variant={"outlined"}
                    color={"secondary"}
                  >
                    Delete Image
                  </Button>
                </div>
              )}
            </div>
          ))}
      </ProfileImageContainer>
    </div>
  );
};

export default connect(null, {
  uploadImage,
  deleteImage
})(withRouter(ProfileImagePage));
