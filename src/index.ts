#!/usr/bin/env node

import { config } from "dotenv";
config();

import { startCLI } from "./cli/index.ts";

startCLI();
