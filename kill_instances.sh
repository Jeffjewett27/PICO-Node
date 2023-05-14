#!/bin/bash

# Convenience script to kill all processes spawned by 'run_instances.sh'
while read pid; do
  sed -i "/$pid/d" pico_processes.log
  if kill $pid; then
    echo "Killed $pid"
  fi
done < pico_processes.log