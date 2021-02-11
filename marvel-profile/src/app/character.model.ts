export interface Character {
  id: string;
  name: string;
}

export interface Profile {
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
