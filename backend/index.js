const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 8080;

app.use(cors({ origin: "http://localhost:3000" }));


app.use(express.json());

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const QuestionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    sliderMin: Number,
    sliderMax: Number,
    sliderStep: Number
}, { _id: false });

const FormSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [QuestionSchema],
    createdAt: { type: Date, default: Date.now }
});

const Form = mongoose.model('Form', FormSchema);

const AnswerSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const ResponseSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: [AnswerSchema],
    respondedAt: { type: Date, default: Date.now }
});

const Response = mongoose.model('Response', ResponseSchema);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/forms', async (req, res) => {
    try {
        console.log(req.body);
        const { userId, title, description, questions } = req.body;
        if (!userId || !title || !questions) {
            return res.status(400).json({ error: 'userId, title et questions sont requis' });
        }
        const form = new Form({
            userId,
            title,
            description,
            questions
        });
        console.log(form);
        await form.save();
        res.status(201).json(form);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/forms', async (req, res) => {
    try {
        const { userId, title, formId } = req.query;
        const filter = {};

        if (userId) {
            filter.userId = userId;
        }
        if (title) {
            filter.title = { $regex: new RegExp(title, "i") }; // Recherche insensible à la casse
        }
        if (formId) {
            filter._id = formId;
        }

        const forms = await Form.find(filter);
        res.json(forms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/forms/:id', async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        if (!title || !questions) {
            return res.status(400).json({ error: 'title et questions sont requis' });
        }
        const updatedForm = await Form.findByIdAndUpdate(
            req.params.id,
            { title, description, questions },
            { new: true }
        );
        if (!updatedForm) return res.status(404).json({ error: 'Formulaire non trouvé' });
        res.json(updatedForm);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/forms/:id', async (req, res) => {
    try {
        const form = await Form.findByIdAndDelete(req.params.id);
        if (!form) return res.status(404).json({ error: 'Formulaire non trouvé' });

        await Response.deleteMany({ formId: form._id });
        res.json({ message: 'Formulaire et réponses associées supprimées' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// { answers: [ { questionId: "id", answer: "réponse" }, ... ] }
app.post('/forms/:id/responses', async (req, res) => {
    try {
        const formId = req.params.id;
        const form = await Form.findById(formId);
        if (!form) return res.status(404).json({ error: 'Formulaire non trouvé' });
        const { answers } = req.body;
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Les réponses doivent être fournies sous forme de tableau' });
        }
        const responseDoc = new Response({
            formId,
            answers
        });
        await responseDoc.save();
        res.status(201).json(responseDoc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/forms/:id/responses', async (req, res) => {
    try {
        const responses = await Response.find({ formId: req.params.id });
        res.json(responses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/responses/:id', async (req, res) => {
    try {
        const responseDoc = await Response.findByIdAndDelete(req.params.id);
        if (!responseDoc) return res.status(404).json({ error: 'Réponse non trouvée' });
        res.json({ message: 'Réponse supprimée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});