#!/bin/bash
cd "$(dirname "$0")"
node server.js &
SERVER_PID=$!

# Warten bis der Server auf Port 3000 antwortet
while ! curl -s http://localhost:3000 > /dev/null 2>&1; do
  sleep 0.2
done

open "http://localhost:3000"
wait $SERVER_PID
