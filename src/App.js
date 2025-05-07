import { useState, useEffect, useRef, useCallback } from 'react';

// --- Helper Function: Levenshtein Distance ---
const levenshtein = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const TerminalPortfolio = () => {
  const [typedText, setTypedText] = useState('');
  const [commandHistory, setCommandHistory] = useState([]); // For display
  const [rawCommandHistory, setRawCommandHistory] = useState([]); // For navigation/resubmit
  const [historyIndex, setHistoryIndex] = useState(-1); // -1 means not navigating
  const [currentInput, setCurrentInput] = useState('');
  const [lastLoginTime, setLastLoginTime] = useState(''); // State for login time
  const [currentPath, setCurrentPath] = useState('~/Desktop'); // State for current directory path
  const inputRef = useRef(null);
  const contentRef = useRef(null);
  const currentYear = new Date().getFullYear();
  
  // Get login time once on mount
  useEffect(() => {
      setLastLoginTime(new Date().toLocaleString());
  }, []);

  // Define initial welcome text
  const initialWelcomeTextRef = useRef('');
  useEffect(() => {
    if (lastLoginTime && initialWelcomeTextRef.current === '') {
        // Set the initial welcome text string ONCE when lastLoginTime is available
        initialWelcomeTextRef.current = `Last login: ${lastLoginTime}\nType 'help' to see available commands`;
        // Start typing immediately if needed
        if (typedText.length < initialWelcomeTextRef.current.length) {
             const textToType = initialWelcomeTextRef.current;
             let i = 0;
             const intervalId = setInterval(() => {
                 setTypedText(textToType.slice(0, i + 1));
                 i++;
                 if (i >= textToType.length) {
                     clearInterval(intervalId);
                 }
             }, 15);
             return () => clearInterval(intervalId); // Cleanup interval on unmount
        }
    }
  }, [lastLoginTime]); // Only depends on lastLoginTime to trigger setup

  // Type welcome text animation effect
  useEffect(() => {
      const textToType = initialWelcomeTextRef.current;
      if (textToType && typedText.length < textToType.length) {
          const timeout = setTimeout(() => {
              setTypedText(textToType.slice(0, typedText.length + 1));
          }, 15);
          return () => clearTimeout(timeout);
      }
  }, [typedText]); // Depends only on typedText to continue typing

  // Colors from catppuccin mocha palette
  const colors = {
    base: '#1e1e2e',
    text: '#cdd6f4',
    green: '#a6e3a1',
    yellow: '#f9e2af',
    red: '#f38ba8',
    blue: '#89b4fa',
    pink: '#f5c2e7',
    lavender: '#b4befe',
    mauve: '#cba6f7',
    peach: '#fab387',
    crust: '#11111b',
    mantle: '#181825',
    surface0: '#313244',
    surface1: '#45475a',
  };

  // Project data
  const projects = [
    {
      id: 1,
      title: "Flavor Mixing",
      fileName: "flavor-mixing",
      description: "An interactive crowdsourced experiment where users vote on hypothetical flavor combinations. The app collects data on which flavor pairings work best according to public opinion and visualizes the results in real-time.",
      link: "https://flavor-mixing.com",
      color: colors.green,
      tags: ["react"]
    },
    {
      id: 2,
      title: "Fantasy Names",
      fileName: "fantasy-names",
      description: "A fantasy name generator built with linguistic principles. Uses a block-based algorithm with compatibility scoring to create authentic-sounding names for different fantasy species such as elves, orcs, and druids.",
      link: "https://fantasy-names.charliebeutter.com",
      color: colors.pink,
      tags: ["python", "flask"]
    },
    {
      id: 3,
      title: "???",
      fileName: "unknown",
      description: "Coming soon...",
      link: "",
      color: colors.yellow,
      tags: ["?"]
    },
  ];

  // --- Reusable Project Item Component ---
  const ProjectItem = ({ project, colors }) => (
    <div
      className="project-item"
      style={{
        background: colors.surface0,
        padding: '12px',
        borderRadius: '4px',
        borderLeft: `4px solid ${project.color}`
      }}
    >
      <h3 style={{ color: colors.lavender, marginBottom: '8px', fontSize: '16px', fontWeight: 600, lineHeight: '1.3' }}>
        <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${colors.lavender}` }}>
          {project.title}
        </a>
      </h3>
      <p style={{ marginBottom: '8px' }}>{project.description}</p>
      <div>
        {project.tags.map((tag, idx) => (
            <span
                key={idx}
                style={{
                  background: colors.surface1,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginRight: '8px',
                  fontSize: '12px',
                  color:
                        tag === 'react' ? colors.blue :
                        tag === 'python' ? colors.green :
                        tag === 'flask' ? colors.peach :
                        tag === '?' ? colors.mauve :
                        colors.text,
                  lineHeight: '1.3',
                  display: 'inline-block',
                }}
              >
                {tag}
              </span>
        ))}
      </div>
    </div>
  );

  const aboutContent = useCallback(() => (
    <div
      style={{
        background: colors.surface0,
        padding: '12px',
        borderRadius: '4px',
        borderLeft: `4px solid ${colors.yellow}`,
      }}
    >
      <p>Hey! I'm Charlie Beutter, a 20-year-old coder who likes to make things.</p>
      <p>You can check out my projects using the 'projects' command.</p>
      <p>Enjoy your stay!</p>
    </div>
  ), [colors]);

  const contactContent = useCallback(() => (
    <div
      style={{
        background: colors.surface0,
        padding: '12px',
        borderRadius: '4px',
        borderLeft: `4px solid ${colors.blue}`,
      }}
    >
      <p><span style={{color: colors.mauve}}>Email:</span> charlie.beutter@gmail.com</p>
      <p><span style={{color: colors.mauve}}>GitHub:</span> github.com/charliebutter</p>
    </div>
  ), [colors]);

// --- Filesystem Structure ---
  const filesystem = useRef({
    '~': {
      type: 'directory',
      content: {
        'Desktop': {
          type: 'directory',
          content: {
            'about.txt': { type: 'file', content: aboutContent },
            'contact.txt': { type: 'file', content: contactContent },
            'banner.txt': {
              type: 'file',
              content: `
   ____ _                _ _        ____             _   _            
  / ___| |__   __ _ _ __| (_) ___  | __ )  ___ _   _| |_| |_ ___ _ __ 
 | |   | '_ \\ / _\` | '__| | |/ _ \\ |  _ \\ / _ \\ | | | __| __/ _ \\ '__|
 | |___| | | | (_| | |  | | |  __/ | |_) |  __/ |_| | |_| ||  __/ |   
  \\____|_| |_|\\__,_|_|  |_|_|\\___| |____/ \\___|\\__,_|\\__|\\__\\___|_|   
                                                                      
`
            },
            'projects': {
              type: 'directory',
              content: {} // Content dynamically generated by ls
            }
          }
        },
        'Downloads': {
          type: 'directory',
          content: {
            'top_secret.txt': {
               type: 'file',
               content: `Grandma's Gingersnaps
---------------------

Ingredients:
*   3/4 cup shortening
*   1 cup brown sugar (or white)
*   1 egg
*   1/4 cup molasses
*   2 1/4 cup flour
*   2 tsp baking soda
*   1 tsp cinnamon
*   1 tsp ginger
*   1/2 tsp cloves
*   1/4 tsp salt

Instructions:
1.  Cream shortening, sugar, egg, and molasses until smooth.
2.  Mix in remaining ingredients, cover, and chill 1 hour (important!).
3.  Preheat oven to 375°F (190°C).
4.  Shape dough into 1-inch balls and roll them in sugar.
5.  Place balls about 3 inches apart on a baking sheet.
6.  Bake for 10-12 minutes.
7.  Enjoy!
`
            }
          }
        }
      }
    }
  }).current;

  // --- Filesystem Helper Functions ---

  // Helper to resolve a path string
  const resolvePath = useCallback((targetPath) => {
    // Handle empty or null target path -> return current path
    if (!targetPath) return currentPath;

    // Handle absolute path starting from root marker '~' directly
    if (targetPath === '~') return '~';
    if (targetPath === '/') return '~'; // Treat / same as ~

    const currentParts = currentPath.split('/').filter(p => p); // e.g., ['~', 'Desktop']
    let targetParts = targetPath.split('/').filter(p => p);
    let resolvedParts;

    if (targetPath.startsWith('~/')) {
      // Path explicitly starts from home: ['~', 'Desktop', ...]
      resolvedParts = ['~', ...targetParts.slice(1)];
    } else if (targetPath.startsWith('/')) {
      // Path starts from root, treat as home: ['~', 'folder', ...]
      resolvedParts = ['~', ...targetParts];
    } else {
      // Relative path processing
      resolvedParts = [...currentParts]; // Start from current directory parts
      targetParts.forEach(part => {
        if (part === '..') {
          // Go up one level, but don't go above '~'
          if (resolvedParts.length > 1) {
            resolvedParts.pop();
          }
        } else if (part !== '.') {
          // Go down into a directory
          resolvedParts.push(part);
        }
        // Ignore '.' (current directory)
      });
    }

    // Ensure the path starts with '~' if it's not empty
    // (This handles cases where currentPath might be just '~' and relative paths are used)
    if (resolvedParts.length === 0) {
        return '~'; // Should not happen if currentPath always starts with ~, but safe fallback
    }
    if (resolvedParts[0] !== '~') {
        resolvedParts.unshift('~'); // Ensure root marker
    }

    // Join parts back into a string path
    // If only ['~'] remains, join returns '~'. If ['~', 'Desktop'], returns '~/Desktop'
    return resolvedParts.join('/');

  }, [currentPath]);

  // Helper to get the node at a given absolute path
  const getNodeFromPath = useCallback((path) => {
    const parts = path.split('/').filter(p => p);
    let currentNode = filesystem['~'];

    // Handle path starting from root ('~')
    if (parts.length > 0 && parts[0] === '~') {
      // Traverse starting from the second part
       for (let i = 1; i < parts.length; i++) {
           const part = parts[i];
           if (currentNode && currentNode.type === 'directory' && currentNode.content[part]) {
               currentNode = currentNode.content[part];
           } else {
               return null; // Path segment not found
           }
       }
       // If the path was just '~', return the home directory object itself
       return currentNode;
    } else {
       // Invalid path format if it doesn't start conceptually from '~' in our simplified fs
       return null;
    }
  }, [filesystem]);

  // Focus input field on load and when clicking on terminal
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when command history updates or input changes focus
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [commandHistory, currentInput]);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Available commands 
  const commands = {
    help: () => (
      <div className="command-output">
        <p><span style={{color: colors.mauve}}>help</span> - show this help message</p>
        <p><span style={{color: colors.mauve}}>about</span> - about charlie</p>
        <p><span style={{color: colors.mauve}}>projects</span> - view my projects</p>
        <p><span style={{color: colors.mauve}}>contact</span> - contact information</p>
        <p><span style={{color: colors.mauve}}>clear</span> - clear the terminal screen</p>
      </div>
    ),
    about: () => (
      <div className="command-output">
        <p style={{color: colors.yellow, marginBottom: '4px'}}>$ cat about.txt</p>
        {aboutContent()}
      </div>
    ),
    projects: () => {
      // Simulate the command being run and get the actual output from handleLs
      const listOutput = handleLs(['-la', '~/Desktop/projects']);
      return (
          <div className="command-output">
              <p style={{color: colors.mauve, marginBottom: '4px'}}>$ ls -la ~/Desktop/projects/</p>
              {listOutput}
          </div>
      );
  },
    contact: () => (
      <div className="command-output">
         <p style={{color: colors.blue, marginBottom: '4px'}}>$ cat contact.txt</p>
         {contactContent()}
      </div>
    ),
    clear: () => {
      setCommandHistory([]);
      return null;
    }
  };

  // --- Filesystem Command Handlers ---

  const handleCd = (args) => {
    const targetDir = args[0] || '~'; // Default to home if no arg
    const resolved = resolvePath(targetDir);
    const node = getNodeFromPath(resolved);

    if (node && node.type === 'directory') {
      setCurrentPath(resolved);
      return null; // Success, no output
    } else if (node && node.type !== 'directory') {
      return <p style={{color: colors.red}}>cd: not a directory: {targetDir}</p>;
    } else {
      return <p style={{color: colors.red}}>cd: no such file or directory: {targetDir}</p>;
    }
  };

  const handleLs = (args) => {
    // Check for flags and filter them out
    const isLongFormat = args.includes('-la');
    const pathArgs = args.filter(arg => arg !== '-la'); // Keep only non-flag args
    const targetPath = pathArgs[0] || '.'; // Use '.' for current dir default

    const resolved = resolvePath(targetPath);
    const node = getNodeFromPath(resolved);

    // --- Error Handling: Target Not Found ---
    if (!node) {
        // Check if the target itself exists before trying to list contents
        const targetName = targetPath.split('/').pop();
        // Handle cases like 'ls non_existent_dir/' vs 'ls non_existent_file'
        const parentPath = resolved.includes('/') ? resolved.substring(0, resolved.lastIndexOf('/')) || '~' : currentPath;
        const parentNode = getNodeFromPath(parentPath);

        if (parentNode && parentNode.type === 'directory' && parentNode.content[targetName] && parentNode.content[targetName].type === 'file') {
             // If 'ls' is used on an existing file, just list the file itself (regardless of -la)
            return <p style={{color: colors.text}}>{targetName}</p>;
        }
        return <p style={{color: colors.red}}>ls: cannot access '{targetPath}': No such file or directory</p>;
    }

    // --- Error Handling: Target is a File ---
    if (node.type !== 'directory') {
       // If resolved path points to a file, just list the file name (regardless of -la)
       return <p style={{color: colors.text}}>{targetPath.split('/').pop()}</p>;
    }

    // --- Directory Listing Logic ---

    // Special Case: 'ls -la' on the projects directory
    if (resolved === '~/Desktop/projects' && isLongFormat) {
        // Use the ProjectItem component for detailed view
        return (
             <div className="projects-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 {projects.map(project => (
                     <ProjectItem key={project.id} project={project} colors={colors} />
                 ))}
            </div>
        );
    }

    // Standard Listing (or ls on projects without -la)
    let entries = [];
    if (resolved === '~/Desktop/projects' && !isLongFormat) {
        // Simple listing for projects directory
        entries = projects.map(p => ({ name: p.fileName, type: 'file' }));
    } else {
       // Listing for other directories
       entries = Object.entries(node.content).map(([name, entryNode]) => ({
           name,
           type: entryNode.type
       }));
    }

    // Render standard name list
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {entries.map(entry => (
          <span key={entry.name} style={{ color: entry.type === 'directory' ? colors.blue : colors.text }}>
            {entry.name}
          </span>
        ))}
        {/* Add empty div if no entries to prevent collapse */}
        {entries.length === 0 && <div></div>}
      </div>
    );
  };

  const handleCat = (args) => {
    if (args.length === 0) {
      return <p style={{color: colors.red}}>cat: missing filename</p>;
    }
    const targetFile = args[0];
    const resolved = resolvePath(targetFile);

    // --- Check for Project Files FIRST ---
    const resolvedParts = resolved.split('/');
    const filename = resolvedParts.pop(); // Get the last part (potential filename)
    const parentDir = resolvedParts.join('/'); // Get the directory path

    // Check if we are trying to cat something inside the specific projects directory
    if (parentDir === '~/Desktop/projects') {
        const project = projects.find(p => p.fileName === filename);
        if (project) {
            // Found a matching project file, use project component
            return (
                <div style={{ marginTop: '4px' }}>
                    <ProjectItem project={project} colors={colors} />
                </div>
            );
        } else {
             // File name doesn't match any known project in that directory
             return <p style={{color: colors.red}}>cat: {targetFile}: No such file or directory</p>;
        }
    }

    // --- If not a project file, check the regular filesystem ---
    const node = getNodeFromPath(resolved);

    if (!node) {
      return <p style={{color: colors.red}}>cat: {targetFile}: No such file or directory</p>;
    }

    if (node.type === 'directory') {
       // Check if the user tried 'cat projects' (the directory itself)
       if (resolved === '~/Desktop/projects') {
            return <p style={{color: colors.red}}>cat: {targetFile}: Is a directory</p>;
       }
       // Handle other directories
       return <p style={{color: colors.red}}>cat: {targetFile}: Is a directory</p>;
    }


    if (node.type === 'file') {
      const content = typeof node.content === 'function' ? node.content() : node.content;
      return <div style={{marginTop: '4px'}}>{typeof content === 'string' ? <p>{content}</p> : content}</div>;
    }

    return <p style={{color: colors.red}}>cat: {targetFile}: Cannot display content</p>;
  };

  // Handle command input submission
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const commandInput = currentInput.trim();
    if (!commandInput) {
       setCurrentInput('');
       setHistoryIndex(-1);
       return;
    }

    if (rawCommandHistory.length === 0 || rawCommandHistory[rawCommandHistory.length - 1] !== commandInput) {
        setRawCommandHistory(prev => [...prev, commandInput]);
    }
    setHistoryIndex(-1);

    const parts = commandInput.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1).map(arg => arg.replace(/^["']|["']$/g, ''));

    let output = null;
    const pathBeforeCommand = currentPath; // Capture path for history entry

    // --- Check for Filesystem Commands ---
    if (command === 'cd') {
      output = handleCd(args);
      setCommandHistory(prev => [...prev, { command: commandInput, output, path: pathBeforeCommand }]);
    } else if (command === 'ls') {
      output = handleLs(args);
      setCommandHistory(prev => [...prev, { command: commandInput, output, path: pathBeforeCommand }]);
    } else if (command === 'cat') {
      output = handleCat(args);
      setCommandHistory(prev => [...prev, { command: commandInput, output, path: pathBeforeCommand }]);
    }
    // --- If not a filesystem command, check regular commands ---
    else if (command === 'clear') {
      commands.clear(); // Execute directly, doesn't add to visual history
    } else if (commands[command]) {
      output = commands[command]();
      setCommandHistory(prev => [...prev, { command: commandInput, output, path: pathBeforeCommand }]);
    } else {
      // --- Typo suggestion logic ---
      const commandKeys = Object.keys(commands);
      let minDistance = Infinity;
      let suggestion = null;
      const threshold = 2;

      commandKeys.forEach(cmdKey => {
        const distance = levenshtein(command, cmdKey);
        if (distance < minDistance && distance <= threshold) {
          minDistance = distance;
          suggestion = cmdKey;
        }
      });

      if (suggestion) {
        output = <p style={{color: colors.red}}>Command not found: {commandInput}. Did you mean '<span style={{color: colors.yellow}}>{suggestion}</span>'?</p>;
      } else {
        output = <p style={{color: colors.red}}>Command not found: {commandInput}. Type 'help' for available commands.</p>;
      }
      setCommandHistory(prev => [...prev, { command: commandInput, output, path: pathBeforeCommand }]);
    }

    setCurrentInput(''); // Clear input after processing any command
  };

  // --- Helper Function: Get Directory Entries ---
  const getDirectoryEntries = useCallback((absolutePath) => {
    const node = getNodeFromPath(absolutePath);

    if (!node || node.type !== 'directory') {
      return null; // Not a valid directory path
    }

    let entries = [];
    // Special handling for the 'projects' directory listing
    if (absolutePath === '~/Desktop/projects') {
      entries = projects.map(p => ({ name: p.fileName, type: 'file' }));
    } else {
      entries = Object.entries(node.content).map(([name, entryNode]) => ({
        name,
        type: entryNode.type,
      }));
    }
    return entries;
  }, [getNodeFromPath, filesystem, projects]);

// Handle key down events
  const handleKeyDown = (e) => {
    const { key } = e;
    const input = currentInput; // Capture current value

    if (key === 'ArrowUp') {
      e.preventDefault();
      if (rawCommandHistory.length > 0) {
        const newIndex = historyIndex === -1
          ? rawCommandHistory.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(rawCommandHistory[newIndex]);
      }
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex < rawCommandHistory.length) {
          setHistoryIndex(newIndex);
          setCurrentInput(rawCommandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setCurrentInput('');
        }
      }
    } else if (key === 'Tab') {
        e.preventDefault();
        // Use trimStart and split carefully to handle command and arguments
        const trimmedInput = input.trimStart();
        const commandEndIndex = trimmedInput.indexOf(' ');
        const command = commandEndIndex === -1 ? trimmedInput.toLowerCase() : trimmedInput.substring(0, commandEndIndex).toLowerCase();
        const argumentString = commandEndIndex === -1 ? '' : trimmedInput.substring(commandEndIndex).trimStart();

        const knownFsCommands = ['cd', 'ls', 'cat'];

        // --- Filesystem Path Completion ---
        // Attempt FS completion only if it's a known FS command AND there's something in the argument string OR the input ends with a space after the command
        const attemptFsCompletion = knownFsCommands.includes(command) && (argumentString.length > 0 || (commandEndIndex !== -1 && /\s$/.test(input)));

        if (attemptFsCompletion) {
            const argumentParts = argumentString.split(/\s+/); // Split arguments by space
            const lastPart = argumentParts.pop() || ''; // Get the last segment being typed, handle empty case
            const endsWithSpace = /\s$/.test(input);

            let prefixToMatch = '';
            let baseDirRel = '.'; // Relative dir path for lookup

            // Determine the directory to search and the prefix to match based on the *last argument segment*
            if (!endsWithSpace) {
                // Completing the last typed part (e.g., "cat ab", "ls Desk/pro", "ls ~/", "cd ~")
                const lastSlashIndex = lastPart.lastIndexOf('/');
                if (lastSlashIndex !== -1) {
                    // Path contains a slash (e.g., "Desk/pro", "~/")
                    baseDirRel = lastPart.substring(0, lastSlashIndex + 1); // e.g., "Desk/", "~/"
                    prefixToMatch = lastPart.substring(lastSlashIndex + 1); // e.g., "pro", ""
                } else {
                    // No slash in the last part
                    if (lastPart.startsWith('~')) {
                        // Starts with ~, but no slash yet (e.g., "cd ~" or "ls ~D")
                        baseDirRel = '~'; // Base is home
                        prefixToMatch = lastPart.substring(1); // Prefix is after '~' (e.g. "" for "cd ~", "D" for "ls ~D")
                    } else {
                        // Simple relative path part (e.g., "ab" in "cat ab")
                        baseDirRel = '.'; // Current directory base
                        prefixToMatch = lastPart; // e.g., "ab"
                    }
                }
            } else {
                // Input ends with space (e.g., "ls Desktop/ ") - complete *inside* the directory specified by the last argument
                prefixToMatch = ''; // Match anything starting
                baseDirRel = lastPart || '.'; // Use the last argument segment as the base directory. If input was just "ls ", lastPart is '', use '.'
            }

            // Resolve the base directory to an absolute path
            const baseDirAbs = resolvePath(baseDirRel);
            const entries = getDirectoryEntries(baseDirAbs);

            if (entries) {
                const lowerCasePrefix = prefixToMatch.toLowerCase();
                const matches = entries.filter(entry =>
                    entry.name.toLowerCase().startsWith(lowerCasePrefix)
                );

                if (matches.length === 1) {
                    const match = matches[0];
                    const completedName = match.type === 'directory' ? match.name + '/' : match.name;

                    let newInput = '';

                    if (!endsWithSpace) {
                        // Find where the last argument part starts in the original input string
                        const indexOfLastPart = input.lastIndexOf(lastPart);

                        // Calculate the base path within the last argument part
                        const basePathWithinLastPart = lastPart.substring(0, lastPart.length - prefixToMatch.length);

                        let newLastPart;
                        if (basePathWithinLastPart === '~' && !completedName.startsWith('/')) {
                            // If the base was just '~' and completion doesn't add a '/', add it ourselves
                            newLastPart = basePathWithinLastPart + '/' + completedName;
                        } else {
                            // Standard construction
                            newLastPart = basePathWithinLastPart + completedName;
                        }

                        // Reconstruct the input string
                        newInput = input.substring(0, indexOfLastPart) + newLastPart;

                    } else {
                        // Append the completed name after the space
                        newInput = input + completedName;
                    }

                    // Add a space after completing a file name for convenience
                    if (match.type === 'file' && !newInput.endsWith(' ')) {
                        newInput += ' ';
                    }

                    setCurrentInput(newInput);
                    setHistoryIndex(-1); // Reset history index as input changed
                    return;
                }
            }
        }

        // --- Fallback to Command Completion ---
        // Only if FS completion didn't happen and we are likely typing the command itself
        if (commandEndIndex === -1 && argumentString.length === 0 && !/\s$/.test(input)) {
            const commandKeys = Object.keys(commands);
            const allCompletableCommands = [...commandKeys, 'cd', 'ls', 'cat'];
            const lowerCaseInput = input.toLowerCase();
            const commandMatches = allCompletableCommands.filter(cmd => cmd.startsWith(lowerCaseInput));

            if (commandMatches.length === 1) {
                setCurrentInput(commandMatches[0] + ' ');
                setHistoryIndex(-1); // Reset history index
            }
        }

    } else if (key === 'Enter') {
      handleCommandSubmit(e);
    }
  };

  // Reset history navigation index if user starts typing normally
  const handleInputChange = (e) => {
      setCurrentInput(e.target.value);
      setHistoryIndex(-1); // Reset history index on manual input change
  };

  return (
    // Base container
    <div
      style={{
        backgroundColor: colors.base,
        color: colors.text,
        fontFamily: '"Fira Code", monospace',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '1.3',
        padding: '0',
        margin: '0',
        height: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      onClick={handleTerminalClick}
    >
      {/* Terminal Header */}
      <div
        style={{
          backgroundColor: colors.crust,
          padding: '8px 16px',
          borderBottom: `1px solid ${colors.surface0}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{color: colors.peach}}>Charlie's Desktop</div>
        <div style={{display: 'flex', gap: '8px'}}>
          <span style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.yellow, display: 'inline-block'}}></span>
          <span style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.green, display: 'inline-block'}}></span>
          <span style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors.red, display: 'inline-block'}}></span>
        </div>
      </div>

      {/* Terminal Content Area (Scrollable) */}
      <div
        ref={contentRef}
        style={{
          padding: '16px',
          height: `calc(100% - 41px - 37px)`,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {/* Welcome Text */}
        <div style={{ marginBottom: '8px' }}>
          {typedText}
        </div>

        {/* Command History */}
        {commandHistory.map((item, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            {/* User Command Line - Uses path stored with the command */}
            <div style={{color: colors.green, marginBottom: '4px'}}>
              root@localhost:{item.path}$ {item.command}
            </div>
            {/* Command Output (won't render if item.output is null) */}
            {item.output}
          </div>
        ))}

        {/* Command Input Line */}
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span style={{color: colors.green, whiteSpace: 'nowrap'}}>root@localhost:{currentPath}$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.text,
              fontFamily: 'inherit',
              fontWeight: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              padding: '0',
              width: '100%',
              outline: 'none',
              caretColor: colors.text,
            }}
            spellCheck="false"
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>

      {/* Terminal Footer */}
      <div
        style={{
          backgroundColor: colors.mantle,
          padding: '8px 16px',
          borderTop: `1px solid ${colors.surface0}`,
          fontSize: '14px',
          fontWeight: 500,
          position: 'fixed',
          bottom: '0',
          width: '100%',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <span style={{color: colors.mauve}}>v1.1.0</span>
        <span style={{float: 'right', color: colors.green}}>charlies-desktop</span>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        p, h3 {
          margin: 0;
          padding: 0;
          line-height: 1.3;
        }

        .command-output p:not(:last-child),
        .project-item p:not(:last-child),
        .command-output > div > p:not(:last-child) {
             margin-bottom: 4px;
        }

        .project-item h3 a {
           color: inherit;
        }

      `}</style>
    </div>
  );
};

export default TerminalPortfolio;
