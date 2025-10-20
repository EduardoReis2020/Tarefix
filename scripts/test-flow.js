#!/usr/bin/env node
// Test flow script: register -> login -> create team -> create task -> list tasks
// Usage: node scripts/test-flow.js

const BASE = process.env.BASE_URL || 'http://localhost:3000';

function log(...args) { console.log(...args); }

async function req(path, options = {}) {
    const url = `${BASE}${path}`;
    log(`
    REQUEST ${options.method || 'GET'} ${url}`);
    if (options.body) log('BODY:', options.body);
    const res = await fetch(url, options);
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }
    log('RESPONSE', res.status, body);
    return { ok: res.ok, status: res.status, body };
}

function decodeJwt(token) {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1];
        const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const buf = Buffer.from(b64, 'base64');
        return JSON.parse(buf.toString('utf8'));
    } catch {
        return null;
    }
}

async function main() {
    log('Base URL:', BASE);

    const timestamp = Date.now();
    const email = `test+${timestamp}@example.com`;
    const password = 'Senha1234!';
    const name = 'Teste Flow';

    // Register
    const reg = await req('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    let userId = reg.body && reg.body.user && reg.body.user.id;

    // Login
    const login = await req('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!login.ok) {
        log('Login failed, aborting');
        process.exit(1);
    }

    const token = login.body && login.body.token;
    if (!token) {
        log('No token returned from login; aborting');
        process.exit(1);
    }

    // Decode token to get userId if registration didn't return
    if (!userId) {
        const payload = decodeJwt(token);
        userId = payload && payload.userId;
    }

    log('UserId resolved:', userId);

    // Create team
    const teamName = `Team Test ${timestamp}`;
    const createTeam = await req('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: teamName, description: 'Equipe de teste', ownerId: 'self' }),
    });

    if (!createTeam.ok) {
        log('Create team failed, aborting');
        process.exit(1);
    }

    const team = createTeam.body && createTeam.body.team;
    const teamId = team && team.id;
    log('TeamId:', teamId);

    // Create task
    const taskTitle = 'Tarefa de teste via script';
    const createTask = await req('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: taskTitle, description: 'Descrição', teamId }),
    });

    if (!createTask.ok) {
        log('Create task failed');
    }

    // List tasks
    const listTasks = await req('/api/tasks', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!listTasks.ok) {
        log('List tasks failed');
        process.exit(1);
    }

    log('\n=== Summary ===');
    log('Registered email:', email);
    log('User id:', userId);
    log('Team id:', teamId);
    log('Created task status:', createTask.status);
    log('Tasks returned:', Array.isArray(listTasks.body) ? listTasks.body.length : JSON.stringify(listTasks.body));

    process.exit(0);
    }

    main().catch(err => { console.error(err); process.exit(1); });
