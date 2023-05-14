#!/bin/bash

# Convenience method to spawn n pico processes
if [ "$#" -lt 1 ]; then
  echo "Usage: multipico n arg1 arg2 arg3 ..."
  echo "Creates n pico instances with additional args passed"
  exit 1
fi

n=$1
shift

for ((i=1;i<=n;i++)); do
  node src/picorunner.js "$@" &>/dev/null &
  pid=$!
  echo $pid >> pico_processes.log
  echo $pid
done