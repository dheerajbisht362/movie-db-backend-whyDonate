"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const FSDB = require("file-system-db");
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = require("./middleware/auth");
const node_fetch_commonjs_1 = __importDefault(require("node-fetch-commonjs"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const db = new FSDB("./user.json", false);
app.post("/login", (req, res) => {
    const { name, email, password } = req.body;
    const user = db.get(email);
    if (user) {
        if (password == user.password) {
            const token = jsonwebtoken_1.default.sign({ user: user._id, email }, "TOKEN-KEY", {
                expiresIn: "10h",
            });
            // save user token
            return res.status(200).send({ message: "Logged In", token });
        }
        else {
            return res.status(401).send("Incorrect Password");
        }
    }
    else {
        db.set(email, req.body);
        const token = jsonwebtoken_1.default.sign({ user: user._id, email }, "TOKEN-KEY", {
            expiresIn: "10h",
        });
        return res.status(200).send({ message: "Successfully Created User", token });
    }
});
app.get("/movies/:query", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = db.get(req.user.email);
        if (user) {
            const url = `https://api.tvmaze.com/search/shows?q=${req.params.query}`;
            const dataJson = yield (0, node_fetch_commonjs_1.default)(url)
                .then((response) => response.json())
                .then((json) => {
                return json;
            })
                .catch((err) => res.status(401).send(err));
            return res.status(200).send(dataJson);
        }
        res.status(200).send("Pease Login");
    }
    catch (err) {
        res.send(err);
    }
}));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on PORT ${port}`);
});
