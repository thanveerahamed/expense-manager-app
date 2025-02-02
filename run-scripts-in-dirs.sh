#!/bin/bash
command=${1}
# Loop through all subdirectories in the current folder
for dir in */; do
    # Check if the directory contains a package.json file
    if [ -f "$dir/package.json" ]; then
        echo "Running npm command in $dir..."
        # Change into the directory and execute the npm command
        cd "$dir"
        npm run $command # Replace with your desired npm command
        cd ..
    fi
done

echo "Done running npm commands in all directories."
