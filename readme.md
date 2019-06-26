Getting Setup.

This is an unoptimized version of the smite data aggregator. The goal of this project will be to take advantage of caching by implementing a solution such as redis.

1. `npm install`
2. Download the Binary DB copy [here](https://drive.google.com/drive/folders/10ByLSvkPJvaMr9OqiXBVPTPh6FpNkVTv?usp=sharing)
3. Make a db called: `SmiteVizDev` and use the folowing command with pg_restore
```
pg_restore -U YOUR_USERNAME -d SmiteVizDev PATH_TO_FILE
```
4. run `npm run start-dev` open up `localhost:5000` and watch how slow big queries really are!
