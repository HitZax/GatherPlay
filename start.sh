#!/bin/bash

echo "========================================"
echo "  GatherPlay v2.0 - Starting Servers"
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "[1/2] Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found! Please install Node.js 18+"
    exit 1
fi

echo "[2/2] Starting servers..."
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  Port 3001"
echo ""
echo "Press Ctrl+C to stop servers"
echo "========================================"
echo ""

npm run dev
