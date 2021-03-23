import {createStyles, makeStyles, Theme} from "@material-ui/core";

export const useTodoListStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: 720,
            height: 500,
        },
    }),
);