# Reddit Outfits (name subject to change)

Reddit Outfits is a web application to view outfits of users from reddit's fashion communities. These include:

- [MaleFashionAdvice](https://reddit.com/r/malefashionadvice)

- [FemaleFashionAdvice](https://reddit.com/r/femalefashionadvice)

- [Streetwear](https://reddit.com/r/streetwear)

- [GoodyearWelt](https://reddit.com/r/goodyearwelt) [To be implemented]

- [RawDenim](https://reddit.com/r/rawdenim) [To be implemented]

Up until now, there has not been a way to view outfits of a user in a condensed fashion. Previously, in order to do so, one would have had to go through a user's comment history and identify comments of their outfits. Now, however, with the advent of Reddit Outfits, one can now view outfits of any user. Reddit Outfits also offers the ability to view all outfits of a given thread, and the ability to sort outfits by score and date posted. There are also statistics pertaining to a given user, thread, and subreddit as a whole.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

<TBD>

### Prerequisites

- [Imgur API key](https://api.imgur.com/)
- [reddit API key](https://www.reddit.com/wiki/api)
- [PostgreSQL database viewer (optional but recommended)](https://www.pgadmin.org/)

Run `npm install` upon acquiring the repo to install any dependencies for Node.

Run `pip freeze requirements.txt` upon acquiring the repo to install any dependencies for Python 3.

### Installing

1. Open up a Terminal window at the top level of the repository.

2. Run `npm start` to spin up a hot-reload development server.

3. In a separate Terminal window, run `npm run serverstart` to run the Express.JS server, which will get data from the database.

## Built With

- [PostgreSQL](https://www.postgresql.org/) - The database used to store outfits, comments, threads, and more
- [Python 3](https://www.python.org/) - Language used to interact with the database (e.g., creating, updating, reading, and deleting records)
- [ReactJS](https://reactjs.org/) - Front-end framework
- [D3.JS v4](https://d3js.org/) - Data visualization framework

## Authors

- **Benjamin Catarevas** - _Author_ - [BenjaminCatarevas](https://github.com/BenjaminCatarevas)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- n1c for the original idea
- Keshav Patel for help throughout this project with numerous technological aspects
