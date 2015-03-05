
TERM = 'WI15'
SUBJECTS = [ 'CSE', 'MATH', 'COGS', 'POLI', 'PHIL', 'CHEM', 'ECON', 'PHYS', 'PSYC' ]

r = requests.post(
  "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm", 
  { 'selectedTerm': 'WI15', 
    'selectedSubjects': 'CSE', 
    'schedOption1': True, 
    'schedOption2': True }
)

