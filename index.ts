"use strict";

const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run() {
  // Let's start by indexing some data
  await client.index({
    index: "products",
    document: {
      id: 123,
      title: "alanya ev ilanı",
      description: "temiz merkezde daire",
    },
  });

  // here we are forcing an index refresh, otherwise we will not
  // get any result in the consequent search
  await client.indices.refresh({ index: "products" });
}

readline.question("What would you like to call: ", async (search: string) => {
  // Let's search!
  const result = await client.search({
    index: "products",
    query: {
      multi_match: { title: search, description: search },
    },
  });

  console.log(result.hits.hits);
  readline.close();
});

/* run().catch(console.log); */
