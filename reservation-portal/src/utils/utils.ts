import {parse, format} from 'date-fns';

export const getParsedDate = () => {
   let date = new Date();
    date.setHours(11, 0, 0, 0);
    return parse(
      format(date, "yyyy-MM-dd HH:mm"),
      "yyyy-MM-dd HH:mm",
      new Date()
    );
}