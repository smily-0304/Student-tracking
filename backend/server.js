require('dotenv').config()
const express= require('express')
const  app= express()
const cors=require('cors')
const {MongoClient,ObjectId}=require('mongodb')
app.use(cors())
app.use(express.json())
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url)
const dbName = process.env.DB_NAME || 'student';

client.connect().then(()=>console.log('mongodb is connected'))
                .catch(()=>console.log('mongodb is not connected'))

const db=client.db(dbName)


app.post('/add',async(req,res)=>{
    const collection=db.collection('details')
    const result= await collection.insertOne(req.body)
    console.log('inserted',result)
    collection.find({}).toArray().then((data)=>{
        console.log(data)
    })
})
app.get('/view',async(req,res)=>{
    const collection=db.collection('details')
    const data=await collection.find({}).toArray()
    res.send(data)
})

app.delete('/delete/:id',async(req,res)=>{
    try{
        const collection = db.collection('details')
        const result= await collection.deleteOne({_id:new ObjectId(req.params.id)})
        if(result.deletedCount===1){
            const data= await collection.find({}).toArray()
            res.status(200).json({
                message:'data deleted successfully',
                data
            })
        }else{
            res.status(404).json({message:"No Document is found with this ID"})
        }
    }catch(err){
        console.log("Error deletion:", err);
        res.status(500).json({message:'failed to delete the data'})

    }
})
app.post('/status', async (req, res) => {
    try {
        const collection = db.collection('status');
        const result = await collection.insertOne(req.body);
        console.log('Inserted:', result);
        res.status(200).send({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server Error" });
    }
});

app.get('/report', async (req, res) => {
    try {
        const { fromDate, toDate, tech } = req.query;

    
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffTime = Math.abs(end - start);
        const totalDaysInRange = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

       
        let studentFilter = {};
        if (tech && tech !== "") {
            studentFilter.Tech = { $regex: new RegExp("^" + tech + "$", "i") };
        }
        const allStudents = await db.collection('details').find(studentFilter).toArray();

     
        let statusQuery = { date: { $gte: fromDate, $lte: toDate } };
        if (tech && tech !== "") {
            statusQuery.technology = { $regex: new RegExp("^" + tech + "$", "i") };
        }

        const attendanceData = await db.collection('status').aggregate([
            { $match: statusQuery },
            { $unwind: "$students" },
            {
                $group: {
                    _id: "$students.name",
                    presentCount: {
                        $sum: { $cond: [{ $eq: ["$students.status", "Present"] }, 1, 0] }
                    }
                }
            }
        ]).toArray();

        const finalReport = allStudents.map(student => {
            const attendance = attendanceData.find(a => a._id === student.Name);
            return {
                _id: student.Name, 
                presentDays: attendance ? attendance.presentCount : 0,
                totalDays: totalDaysInRange 
            };
        });

        res.status(200).json(finalReport);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server Error" });
    }
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server is running in ${PORT}`)
})
