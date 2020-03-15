import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    movieAddList: {
        opacity: '0.5',
        color: '#f7c12d',
        paddingTop: '5px',
        verticalAlign: 'middle' ,
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.05)'
        }
    },
    movieRemoveList: {
        opacity: '0.5',
        color: '#4bbe4b',
        paddingTop: '5px',
        verticalAlign: 'middle' ,
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.05)'
        }
    }
}));

const AddMovie = (props) => {
    const [clicked, setClicked] = useState(null);
    const [watchlist, setWatchlist] = useState(props.watchlist)
    const classes = useStyles();

    useEffect(() => {
        console.log(1);
        if (props && props.watchlist && props.watchlist !== watchlist) {
            setWatchlist(props.watchlist);
            setClicked(null);
        }
    }, [props, clicked])


    if (watchlist && watchlist.length){
        for (var j = 0; j < watchlist.length; j++){
            if (props.id === watchlist[j].id)
                return  <Grid item xs={'auto'} className={classes.movieRemoveList}>
                    <HighlightOffIcon onClick={() =>{setClicked(true) ; props.handleClickAddWatchlist(props.id, 'remove', j) }} id="removeCircle"/>
                </Grid>
        }
    }
    return   <Grid item xs={'auto'} className={classes.movieAddList}>
        <AddCircle onClick={() => { setClicked(false) ; props.handleClickAddWatchlist(props.id, 'add', j) }} id="addCircle"/>
    </Grid>

}

export default AddMovie;