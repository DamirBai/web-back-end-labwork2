const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const upload = multer({ dest: 'uploads/' });
app.get('/', (req, res) => {
    res.render('index');
});
app.post('/send', upload.single('attachment'), async (req, res) => {
    const { from, password, to, subject, text } = req.body;
    const attachment = req.file;
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: from,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: text,
            attachments: attachment ? [{ path: attachment.path }] : []
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
