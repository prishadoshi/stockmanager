import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {




// Replace the uri string with your connection string.

const uri =
  "mongodb+srv://mongodb:kRzNl0BOmzvCXKtf@cluster0.aooplp3.mongodb.net/";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


  try {
    await client.connect();

    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const movie = await movies.findOne(query);

    console.log(movie);
    return NextResponse.json({"a": 34, movie})

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


