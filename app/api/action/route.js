import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {

    // Replace the uri string with your connection string.
    let{action, slug, initialQuantity}= await request.json()
    //console.log(body)
    const uri =
      "mongodb+srv://mongodb:kRzNl0BOmzvCXKtf@cluster0.aooplp3.mongodb.net/";
    
    const client = new MongoClient(uri);
      try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        const filter ={slug:slug};
        
        let newQuantity= action=="plus"? (parseInt(initialQuantity) +1):(parseInt(initialQuantity)-1)
        const updateDoc={
            $set: {
                quantity: newQuantity
            },
        };
        const result = await inventory.updateOne(filter, updateDoc,{});
        
        return NextResponse.json({success:true, message:'${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)'})
        return NextResponse.json({product, ok:true})
    
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }

