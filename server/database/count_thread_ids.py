def count():
    '''
    Count thread IDs of a file.
    '''
    with open('mfa_threads.txt', 'r+') as f:
        d = dict()
        # Move to beginning of file.
        f.seek(0)
        # Get the lines of the file and split them to remove \n.
        lines = f.read().splitlines()
        for line in lines:
            d[line] = d.get(line, 0) + 1
    f.close()
    # return {k: v for k, v in d.items() if v > 1}
    return len(d)
