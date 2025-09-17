import { VisibilityEnum, WeatherEnum } from '../models/enums'
import type { NewExampleReport, Visibility, Weather } from "../models/types";
import { AppError } from "../middlewares/appError";

const parseComment = (commentFromRequest: any): string => {
  if (!isString(commentFromRequest)) {
    throw new AppError("Incorrect or missing comment", 400);
  }
  return commentFromRequest;
};

const parseDate = (dateFromRequest: any): string => {
  if (!isString(dateFromRequest) || !isDate(dateFromRequest)) {
    throw new AppError("Incorrect or missing date: " + dateFromRequest , 400);
  }
  return dateFromRequest;
};

const isString = (text: any): boolean => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseWeather = (weatherFromRequest: any): Weather => {
  if (!isString(weatherFromRequest) || !isWeather(weatherFromRequest)) {
    throw new AppError("Incorrect or missing weather", 400);
  }
  return weatherFromRequest;
};

const isWeather = (param: any): boolean => {
  return Object.values(WeatherEnum).includes(param);
};

const parseVisibility = (visibilityFromRequest: any): Visibility => {
  if (!isString(visibilityFromRequest) || !isVisibility(visibilityFromRequest)) {
    throw new AppError("Incorrect or missing visibility", 400); 
  }
  return visibilityFromRequest;
}

const isVisibility = (param: any): boolean => {
  return Object.values(VisibilityEnum).includes(param);
};  

const parseCost = (costFromRequest: any): number => {
  if (typeof costFromRequest !== "number" || costFromRequest < 0) {
    throw new AppError("Incorrect or missing cost", 400);
  }
  return costFromRequest;
};

const toNewExampleReport = (object: any): NewExampleReport => {
  const newReport: NewExampleReport = {
    comment: parseComment(object.comment),
    date: parseDate(object.date),
    weather: parseWeather(object.weather),
    visibility: parseVisibility(object.visibility),
    cost: parseCost(object.cost)
  };
  return newReport;
};

export default toNewExampleReport;
