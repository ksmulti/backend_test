import express from 'express';
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "@/entity/User";
import { DiaryController } from "@/controllers/DiaryController";
import { authMiddleware } from '@/middleware/authMiddleware';
import { BodyRecordController } from '@/controllers/BodyRecordController';
import { ExerciseRecordController } from '@/controllers/ExerciseRecordController';
import { ExerciseGoalController } from '@/controllers/ExerciseGoalController';

declare module 'express-serve-static-core' {
    interface Request {
        user: User;
    }
}

async function main() {
    try {
        await AppDataSource.initialize();

        console.log("Inserting a default user into the database...");
        const user = new User()
        user.id = 1;
        user.firstName = "Taro";
        user.lastName = "Test";
        user.age = 25;
        await AppDataSource.manager.save(user);
        console.log("Saved a new user with id: " + user.id);

        console.log("Loading users from the database...");
        const users = await AppDataSource.manager.find(User);
        console.log("Loaded users: ", users);
    } catch (error) {
        console.log(error);
    }
}

main();


const app: express.Express = express();
const port = 3000;
app.use(express.json());

app.get('/api/exercise-records', authMiddleware, ExerciseRecordController.getExerciseRecords);
app.post('/api/exercise-records', authMiddleware, ExerciseRecordController.createExerciseRecord);

app.post('/api/exercise-goals', authMiddleware, ExerciseGoalController.createGoal);

app.get('/api/exercise-completion', authMiddleware, ExerciseGoalController.getCompletionRates);

app.get('/api/body-records', authMiddleware, BodyRecordController.getBodyRecords);
app.post('/api/body-records', authMiddleware, BodyRecordController.createBodyRecord);

app.post('/api/diaries', authMiddleware, DiaryController.createDiary);
app.get('/api/diaries/:id', authMiddleware, DiaryController.getDiary);
app.get('/api/diaries', authMiddleware, DiaryController.getDiaries);
app.put('/api/diaries/:id', authMiddleware, DiaryController.updateDiary);
app.delete('/api/diaries/:id', authMiddleware, DiaryController.deleteDiary);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});