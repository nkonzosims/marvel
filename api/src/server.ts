import { from } from "rxjs";
import express from "express";
require('dotenv').config()
const axios = require("axios");
const app = express();

const PORT = process.env.PORT;
const baseUrl = "http://gateway.marvel.com/v1/public/characters";
const publicKey = process.env.MARVEL_KEY;
const ts = process.env.TIME;
const hash = process.env.HASH;


async function getCharacters() {
  const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  const response = axios.get(url);
  return response;
}

async function getProfile(characterId: string) {

  const base = `http://gateway.marvel.com/v1/public/characters/${characterId}`;

  const comicsUrl = `${base}/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  const storiesUrl = `${base}/stories?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  const profileUrl = `${base}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

  const comicsRequest = axios.get(comicsUrl);
  const storiesRequest = axios.get(storiesUrl);
  const profileRequest = axios.get(profileUrl);

  return axios.all([comicsRequest, storiesRequest, profileRequest]).then(axios.spread((...responses: any) => {
    return responses;
  })).catch((errors: any )=> {
    return errors;
  })
}


app.get("/api/marvel/character/profile", async (req, res) => {
  
  let id = req.query["id"];

  if(req.query['id'] !== null || req.query['id']!== undefined) {
    id = req.query["id"]!.toString();
    const response = await getProfile(id);
    const comics_res = response[0];
    const stories_res = response[1];
    const character_res = response[2];
  
    const comics: any = [];
    const stories: any = [];

    const comicsArr = comics_res.data.data.results;
    const storiesArr = stories_res.data.data.results;
    const characterArr = character_res.data.data.results[0];
    
    comicsArr.forEach((comic:any) => {
      comics.push({
        title: comic.title,
        issueNumber: comic.issueNumber,
        description: comic.description
      })
    });

    storiesArr.forEach((story: any) => {
      stories.push({
        title: story.title,
        description: story.description
      })
    })

    let profile: ProfileModel = {
      characters: {
        name: characterArr.name,
        imagePath: characterArr.thumbnail.path,

        stories: stories,
        comics: comics
      }
    }
    res.json(profile)
  }
});

app.get("/api/marvel/characters", (req, res) => {
  const observable = from(getCharacters());
  observable.subscribe(
    (success) => {
      const data = success.data.data.results;
      const list: Array<Character> = [];
      data.forEach((element: any) => {
        list.push({
          id: element.id.toString(),
          name: element.name,
        });
      });
      res.json(list);
    },
    (error) => {
      res.json(error);
    }
  );
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

export interface Character {
  id: string;
  name: string;
}

interface ProfileModel {
  characters: {
    name: string;
    imagePath: string;
    stories: [
      {
        name: string;
        title: string;
        description: string;
      }
    ];
    comics: [
      {
        title: string;
        issueNumber: string;
        description: string;
      }
    ];
  };
}
