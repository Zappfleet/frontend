import { Box, Divider, Grid, ScrollArea, Text } from "@mantine/core";

import logoSnap from "../../../assets/imgs/snapp.png"
import logoTaxi from "../../../assets/imgs/taxi.png"

export default function AvailableDrivers({ cars, height, fixHeight, handleAddCarToTripDraft }) {

    return <Box
        className="shadow-sm clickable"
        sx={(theme) => ({
            border: `2px solid ${theme.colors.violet[1]}`,
            textAlign: "center",
            padding: theme.spacing.xs,
            marginBottom: theme.spacing.md,
            borderRadius: theme.radius.md,
            transition: "0.2s",
            maxHeight: "100%",
            height: height - fixHeight,
        })}
    >
        <Text>رانندگان</Text>
        <Divider my="sm" />
        <ScrollArea
            style={{
                height: "90%",
            }}
        >
            {cars?.map((c) => (
                <>
                    <Grid
                        className="m-0"
                        sx={(theme) => ({
                            transition: "0.2s",
                            "&:hover": {
                                backgroundColor: theme.colors.gray[1],
                            },
                        })}
                        onClick={() => handleAddCarToTripDraft(c?._id)}
                    >
                        <Grid.Col span={6}>
                            <Text align="left" className="mb-2">
                                <CarIcon car={c} />
                                {c?.label}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Text align="right" className="mb-2">
                                {c?.status ? "در مسیر" : "آزاد"}
                            </Text>
                        </Grid.Col>
                    </Grid>
                    <Divider my="xs" />
                </>
            ))}
        </ScrollArea>
    </Box>
}

function CarIcon({ car }) {
    if (car.group == 0) return "";

    if (car.group == 1) return <img className="m-1" width={15} src={logoTaxi} />;

    if (car.group == 2) return <img className="m-1" width={15} src={logoSnap} />;

}