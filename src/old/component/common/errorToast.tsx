import { showNotification } from "@mantine/notifications";
import { X, Checks } from "tabler-icons-react";
export const ErrorToast = ({ message }:any) => {
  return showNotification({
    disallowClose: false,
    title: message,
    message: "خطا",
    color: "red",
    icon: <X />,
    styles: () => ({
      title: { fontSize: "100%" },
      description: { fontSize: "100%" },
    }),
  });
};
export const SucccessToast = ({ message }:any) => {
  return showNotification({
    disallowClose: false,
    message: "عملیات موفقیت آمیز",
    title: message,
    color: "green",
    icon: <Checks />,
    styles: () => ({
      title: { fontSize: "100%", lineHeight: "2" },
      description: { fontSize: "100%" },
    }),
  });
};
