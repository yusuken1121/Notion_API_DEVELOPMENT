import { Request, Response } from "express";
import { notion } from "../config/config";
import { NOTION_DATABASE_ID } from "../env";
import { getNotionSchema } from "../services/notionService";

export const getTestDb = async (req: Request, res: Response) => {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID!,
    });

    res.json(response.results);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getSchema = async (req: Request, res: Response) => {
  try {
    const notionSchema = await getNotionSchema();
    res.status(200).json(notionSchema);
  } catch (error) {
    console.error("cannot get the notion schema", error);
    res.status(401).json({ message: "cannot get the schema" });
  }
};

export const postTestDb = async (req: Request, res: Response) => {
  const { title, selectedValue, date, phoneNumber, email, url } = req.body;
  console.log(
    "title: ",
    title,
    "selectedValue: ",
    selectedValue,
    "date: ",
    date,
    "phoneNumber: ",
    phoneNumber,
    "email: ",
    email,
    "url: ",
    url
  );

  try {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID! },

      properties: {
        Checkbox1: {
          type: "checkbox",
          checkbox: true,
        },
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: title,
              },
            },
          ],
        },
        Status: {
          type: "status",
          status: {
            name: selectedValue,
          },
        },
        Date: {
          date: {
            start: date,
            // end: "2024-08-20",
            time_zone: null,
          },
        },
        Phone1: {
          type: "phone_number",
          phone_number: phoneNumber,
        },
        Email1: {
          type: "email",
          email,
        },
        URL1: {
          type: "url",
          url,
        },
      },
    });
    res.status(200).json({ message: "Data added successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Error adding data", error });
  }
};
