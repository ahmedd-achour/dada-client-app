import os

filepath = 'src/app/admin/attempt-detail/attempt-detail.html'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# find <div class="card assets-card">
start_idx = -1
for i, line in enumerate(lines):
    if '<div class="card assets-card">' in line:
        start_idx = i
        break

# find the matching closing div
end_idx = -1
if start_idx != -1:
    depth = 0
    for i in range(start_idx, len(lines)):
        if '<div' in lines[i]:
            depth += lines[i].count('<div')
        if '</div' in lines[i]:
            depth -= lines[i].count('</div')
        if depth == 0:
            end_idx = i
            break

print(f"Start: {start_idx}, End: {end_idx}")
