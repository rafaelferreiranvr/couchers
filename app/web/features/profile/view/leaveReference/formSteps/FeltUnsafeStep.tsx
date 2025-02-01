import { styled, Typography, useMediaQuery } from "@mui/material";
import Button from "components/Button";
import TextBody from "components/TextBody";
import TextField from "components/TextField";
import { useProfileUser } from "features/profile/hooks/useProfileUser";
import { GLOBAL, PROFILE } from "i18n/namespaces";
import { useRouter } from "next/router";
import { ReferenceType } from "proto/references_pb";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
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

const StyledButtonContainer = styled("div")(({ theme }) => ({
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

const StyledTextField = styled(TextField)(({ theme }) => ({
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

  const user = useProfileUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<ReferenceContextFormData>({});

  const onSubmit = handleSubmit((values) => {
    setReferenceValues(values);
    if (
      referenceType === referenceTypeRoute[ReferenceType.REFERENCE_TYPE_FRIEND]
    ) {
      router.push(
        `${leaveReferenceBaseRoute}/${referenceType}/${user.userId}/${referenceStepStrings[3]}`,
      );
    } else {
      router.push(
        `${leaveReferenceBaseRoute}/${referenceType}/${user.userId}/${hostRequestId}/${referenceStepStrings[3]}`,
      );
    }
  });

  return (
    <StyledForm onSubmit={onSubmit}>
      <ReferenceStepHeader name={user.name} referenceType={referenceType} />
      <StyledTextBody isBold>
        You answered that <RedText>you felt unsafe</RedText> with this person's
        behavior.
      </StyledTextBody>
      <StyledTextBody>
        In the box below you can privately tell our Safety Team what happened.
      </StyledTextBody>
      <StyledTextBody>
        <BoldText>This will only be seen by our Safety Team</BoldText> and will
        stay <BoldText>private</BoldText>. The more details the better, but even
        a short explanation will help a lot. Read more here.
      </StyledTextBody>
      <StyledTextBody>
        Thank you for helping us keep the community safe!
      </StyledTextBody>
      <Typography variant="h3" sx={{ marginTop: theme.spacing(4) }}>
        What happened?
      </Typography>
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
      <StyledButtonContainer>
        <Button fullWidth={isMobile} type="submit">
          {t("profile:leave_reference.next_step_label")}
        </Button>
      </StyledButtonContainer>
    </StyledForm>
  );
};

export default FeltUnsafeStep;
