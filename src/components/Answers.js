import classes from "../styles/Answers.module.css";
import Checkbox from "./Checkbox";
import { Fragment } from "react";

export default function Answers({options = [], handleChange, input}) {
  return (
    <div className={classes.answers}>
      {options.map((option, index) =>
      (
        <Fragment key={index}>
          {input ? (
            <Checkbox
              className={classes.answer}
              text={option.title}
              key={index}
              value={ index}
              checked={option.checked}
              onChange={(e) => handleChange(e, index)} />
          ) : (
            <Checkbox
                className={`${classes.answer} 
                ${option.correct ? classes.correct :
                  option.checked ? classes.wrong : null}`}
                text={option.title}
                key={index}
                defaultChecked={option.checked}
                disabled
           />
          )}
        </Fragment>
      ))
      }
    </div>
  );
}