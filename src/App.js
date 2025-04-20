import { useState, useEffect, useRef } from 'react';

const TerminalPortfolio = () => {
  const [typedText, setTypedText] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef(null);
  const contentRef = useRef(null);
  const currentYear = new Date().getFullYear();
  
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
      description: "An interactive crowdsourced experiment where users vote on hypothetical flavor combinations. The app collects data on which flavor pairings work best according to public opinion and visualizes the results in real-time.",
      link: "https://flavor-mixing.com",
      color: colors.green,
      tags: ["react"]
    },
    {
      id: 2,
      title: "Fantasy Names",
      description: "A fantasy name generator built with linguistic principles. Uses a block-based algorithm with compatibility scoring to create authentic-sounding names for different fantasy species such as elves, orcs, and druids.",
      link: "https://fantasy-names.charliebeutter.com",
      color: colors.pink,
      tags: ["python", "flask"]
    },
  ];
  
  // Terminal welcome text - purely instructional
  const welcomeText = `root@localhost:~$ type 'help' to see available commands`;
  
  // Type welcome text with animation effect - faster (15ms)
  useEffect(() => {
    if (typedText.length < welcomeText.length) {
      const timeout = setTimeout(() => {
        setTypedText(welcomeText.slice(0, typedText.length + 1));
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);
  
  // Focus input field on load and when clicking on terminal
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Scroll to bottom when command history updates
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [commandHistory]);
  
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Available commands
  const commands = {
    help: () => (
      <div className="command-output" style={{marginTop: '4px'}}>
        <p><span style={{color: colors.mauve}}>help</span> - show this help message</p>
        <p><span style={{color: colors.mauve}}>about</span> - about charlie</p>
        <p><span style={{color: colors.mauve}}>projects</span> - view my projects</p>
        <p><span style={{color: colors.mauve}}>contact</span> - contact information</p>
        <p><span style={{color: colors.mauve}}>clear</span> - clear the terminal</p>
      </div>
    ),
    about: () => (
      <div className="command-output" style={{marginTop: '4px'}}>
        <p style={{color: colors.yellow}}>$ cat about.txt</p>
        <p>hey! i'm charlie, a hobbyist coder who likes to make cool things.</p>
        <p>i created this website to showcase some of my projects.</p>
        <p>enjoy your stay!</p>
      </div>
    ),
    projects: () => (
      <div className="command-output" style={{marginTop: '4px'}}>
        <p style={{color: colors.mauve}}>$ ls -la ~/projects/</p>
        <div className="projects-list">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="project-item"
              style={{
                background: colors.surface0,
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '12px',
                borderLeft: `4px solid ${project.color}`
              }}
            >
              <h3 style={{color: colors.lavender, margin: '0 0 4px 0', lineHeight: '1.3'}}>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: colors.lavender,
                    textDecoration: 'none',
                    borderBottom: `1px dotted ${colors.lavender}`,
                  }}
                >
                  {project.title}
                </a>
              </h3>
              <p style={{margin: '0 0 8px 0', lineHeight: '1.3'}}>{project.description}</p>
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
                             colors.text,
                      lineHeight: '1.3',
                      display: 'inline-block',
                      marginBottom: '4px'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    contact: () => (
      <div className="command-output" style={{marginTop: '4px'}}>
        <p style={{color: colors.blue}}>$ cat contact.txt</p>
        <p><span style={{color: colors.mauve}}>Email:</span> charlie.beutter@gmail.com</p>
        <p><span style={{color: colors.mauve}}>GitHub:</span> github.com/charliebutter</p>
      </div>
    ),
    clear: () => {
      // Don't need to return any output, the command history will be cleared
      return null;
    }
  };
  
  // Handle command input
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    
    const command = currentInput.trim().toLowerCase();
    
    // Handle clear command specially - clear without showing the command
    if (command === 'clear') {
      setCommandHistory([]);
      setCurrentInput('');
      return;
    }
    
    let output = null;
    if (commands[command]) {
      output = commands[command]();
    } else if (command) {
      output = <p style={{color: colors.red, lineHeight: '1.3', marginTop: '4px'}}>Command not found: {command}. Type 'help' for available commands.</p>;
    }
    
    if (command) {
      setCommandHistory(prev => [...prev, {command: currentInput, output}]);
      setCurrentInput('');
    }
  };
  
  // Handle key down for special keys
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommandSubmit(e);
    }
  };
  
  return (
    <div 
      style={{
        backgroundColor: colors.base,
        color: colors.text,
        fontFamily: '"Fira Code", monospace',
        fontWeight: 500, // Slightly bolder
        padding: '0',
        margin: '0',
        height: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        lineHeight: '1.3', // Global line height
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
          lineHeight: '1.3',
        }}
      >
        <div>Charlie Beutter</div>
        <div style={{display: 'flex', gap: '8px'}}>
          <span style={{
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            backgroundColor: colors.yellow,
            display: 'inline-block'
          }}></span>
          <span style={{
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            backgroundColor: colors.green,
            display: 'inline-block'
          }}></span>
          <span style={{
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            backgroundColor: colors.red,
            display: 'inline-block'
          }}></span>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={contentRef}
        style={{
          padding: '16px',
          height: 'calc(100% - 80px)',
          overflowY: 'auto',
          lineHeight: '1.3', // Consistent line spacing
        }}
      >
        <div style={{
          whiteSpace: 'pre-wrap',
          marginBottom: '8px', // Reduced margin
          lineHeight: '1.3',
        }}>
          {typedText}
        </div>
        
        {/* Command History */}
        {commandHistory.map((item, index) => (
          <div key={index} style={{marginBottom: '8px', lineHeight: '1.3'}}> {/* Reduced margin between blocks */}
            <div style={{color: colors.green, lineHeight: '1.3'}}>root@localhost:~$ {item.command}</div>
            {item.output}
          </div>
        ))}
        
        {/* Command Input */}
        <div style={{display: 'flex', alignItems: 'center', lineHeight: '1.3'}}>
          <span style={{color: colors.green, whiteSpace: 'nowrap', lineHeight: '1.3'}}>root@localhost:~$&nbsp;</span>
          <input 
            ref={inputRef}
            type="text" 
            value={currentInput} 
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: colors.text,
              fontFamily: '"Fira Code", monospace',
              fontWeight: 500, // Slightly bolder
              fontSize: '16px',
              padding: '0',
              width: '100%',
              outline: 'none',
              caretColor: colors.text,
              lineHeight: '1.3',
            }}
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
          fontWeight: 500, // Slightly bolder
          position: 'fixed',
          bottom: '0',
          width: '100%',
          boxSizing: 'border-box',
          lineHeight: '1.3',
        }}
      >
        <span style={{color: colors.mauve}}>v1.0.0</span>
        <span style={{marginLeft: '16px', color: colors.blue}}>© {currentYear} charlie beutter</span>
        <span style={{float: 'right', color: colors.green}}>charlies-desktop</span>
      </div>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          line-height: 1.3;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          line-height: 1.3;
        }
        
        p {
          margin: 0 0 4px 0;
          line-height: 1.3;
        }
        
        /* Last paragraph in each command output should have no bottom margin */
        .command-output p:last-child {
          margin-bottom: 0;
        }
        
        .project-item p, .project-item h3 {
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
};

export default TerminalPortfolio;