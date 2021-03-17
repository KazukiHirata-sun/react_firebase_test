import { FormControl, TextField, List } from '@material-ui/core';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import React, {useState, useEffect } from 'react';
import styles from './App.module.css';
import {db} from "./firebase";
import TaskItem from "./TaskItem";
import { makeStyles } from "@material-ui/styles";

import {auth} from "./firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
})

const App: React.FC = (props: any) => {
  const [tasks, setTasks] = useState([{id:"", title: ""}]);
  const [input, setInput] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push("login");
    });
    return () => unSub();
  }, [props.history])

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapShot) => {
      setTasks(
        snapShot.docs.map((doc) => ({id: doc.id, title: doc.data().title}))
      );
    });
    return () => {
      unSub();
    }
  }, [])

  const newTask = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    db.collection("tasks").add({title: input});
    setInput("");
  }
  
  return (
    <div className={styles.app__root}>
      <h1>TODO with Firebase</h1>
      <button className={styles.app__logout} 
        onClick={
          async ()=> {
            try {
              await auth.signOut();
              props.history.push("login");
            } catch (error) {
              alert(error.message);
            }
        }}
      >
        <ExitToAppIcon />
      </button>
      <br />
      <FormControl>
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink:true
          }}
          label = "New task?"
          value={input}
          onChange={
            (event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setInput(event.target.value);
            }
          }></TextField>
      </FormControl>
      <button className={styles.app__icon} disabled = {!input} onClick={newTask}>
        <PlaylistAddIcon />
      </button>
      <List className={classes.list}>
        {tasks.map((task) => {
          return <TaskItem key = {task.id} id = {task.id} title = {task.title} />
        })}
      </List>
    </div>
  );
}

export default App;
