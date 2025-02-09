import { styled, Typography, useMediaQuery } from "@mui/material";
import Alert from "components/Alert";
import Button from "components/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "components/Dialog";
import TextBody from "components/TextBody";
import TextField from "components/TextField";
import { useProfileUser } from "features/profile/hooks/useProfileUser";
import { GLOBAL, PROFILE } from "i18n/namespaces";
import { useRouter } from "next/router";
import { ReferenceType } from "proto/references_pb";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  helpCenterURL,
  leaveReferenceBaseRoute,
  referenceStepStrings,
  referenceTypeRoute,
} from "routes";
import { theme } from "theme";

import { ReferenceContextFormData, ReferenceStepProps } from "../ReferenceForm";
import ReferenceStepHeader from "./ReferenceStepHeader";

const StyledForm = styled("form")(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledTextBody = styled(TextBody, {
  shouldForwardProp: (prop) => prop !== "isBold",
})<{ isBold?: boolean }>(({ theme, isBold }) => ({
  "& > .MuiInputBase-root": {
    width: "100%",
  },
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    "& > .MuiInputBase-root": {
      width: 400,
    },
  },
  ...(isBold && { fontWeight: 500 }),
}));

const StyledContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  paddingTop: theme.spacing(1),
}));

const RedText = styled("span")`
  color: red;
`;

const BoldText = styled("span")`
  font-weight: 500;
`;

const BlackBoldText = styled("span")(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.common.black,
}));

const LinkText = styled("a")(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledSkipFeedbackText = styled("span")(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.common.black,
  cursor: "pointer",
  textDecoration: "underline",
  marginTop: theme.spacing(2),
}));

const FeltUnsafeStep = ({
  referenceData,
  setReferenceValues,
  referenceType,
  hostRequestId,
}: ReferenceStepProps) => {
  const { t } = useTranslation([GLOBAL, PROFILE]);
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const user = useProfileUser();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<ReferenceContextFormData>({
    defaultValues: {
      privateText: referenceData.privateText,
    },
  });

  const goToNextPage = () => {
    if (
      referenceType === referenceTypeRoute[ReferenceType.REFERENCE_TYPE_FRIEND]
    ) {
      router.push(
        `${leaveReferenceBaseRoute}/${referenceType}/${user.userId}/${referenceStepStrings[2]}`,
      );
    } else {
      router.push(
        `${leaveReferenceBaseRoute}/${referenceType}/${user.userId}/${hostRequestId}/${referenceStepStrings[2]}`,
      );
    }
  };

  const handleDialogClose = () => {
    goToNextPage();
    setIsDialogOpen(false);
  };

  const handleDialogWillHelp = () => {
    setIsDialogOpen(false);
  };

  const handleSubmitClick = handleSubmit((values) => {
    if (!values.privateText) {
      setIsDialogOpen(true);
    } else {
      setReferenceValues(values);
      goToNextPage();
      setIsDialogOpen(false);
    }
  });

  return (
    <>
      <StyledForm onSubmit={handleSubmitClick}>
        <ReferenceStepHeader name={user.name} referenceType={referenceType} />
        <StyledTextBody isBold>
          You answered that <RedText>you felt unsafe</RedText> with this
          person's behavior.
        </StyledTextBody>
        <StyledTextBody>
          In the box below you can privately tell our Safety Team what happened.
        </StyledTextBody>
        <StyledTextBody>
          <BoldText>This will only be seen by our Safety Team</BoldText> and
          will stay <BoldText>private</BoldText>. The more details the better,
          but even a short explanation will help a lot. Read more{" "}
          <LinkText href={helpCenterURL}>here</LinkText>.
        </StyledTextBody>
        <StyledTextBody>
          Thank you for helping us keep the community safe!
        </StyledTextBody>
        <Typography variant="h3" sx={{ marginTop: theme.spacing(4) }}>
          What happened?
        </Typography>
        {errors.privateText?.message && (
          <Alert severity="error" sx={{ marginBottom: theme.spacing(3) }}>
            {errors.privateText.message}
          </Alert>
        )}
        <StyledTextField
          id="privateText"
          {...register("privateText")}
          label={"Share information privately with our Safety Team."}
          name="privateText"
          minRows={5}
          maxRows={5}
          fullWidth
          multiline
          variant="outlined"
        />
        <StyledContainer>
          <Button fullWidth={isMobile} type="submit">
            {t("profile:leave_reference.next_step_label")}
          </Button>
        </StyledContainer>
      </StyledForm>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Please tell our Safety Team what happened
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              You can help keep the community safe by sharing{" "}
              <BlackBoldText>private</BlackBoldText> feedback about what
              happened.
            </p>
            <p>
              <BlackBoldText>Only our Safety Team will see it!</BlackBoldText>{" "}
              Do you want to help keep the community safe?
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column" }}>
          <Button onClick={handleDialogWillHelp}>Yes, I'll help!</Button>
          <StyledContainer>
            <StyledSkipFeedbackText onClick={handleDialogClose} autoFocus>
              No, skip private feedback.
            </StyledSkipFeedbackText>
          </StyledContainer>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeltUnsafeStep;
