import json
import re
import requests

TERM = 'SP15'

r = requests.get('https://act.ucsd.edu/scheduleOfClasses/department-list.json?selectedTerm=' + TERM)
dept_list = json.loads(r.text)
subjects = [dept['code'] for dept in dept_list]
print subjects

courses = []
tasks = []

def newTask():
  return {
    'name': '',
    'class_name': '',
    'class_teacher': '',
    'description': '',
    'due_date': '',
    'is_shared': True,
    'is_endorsed': True
  }

for subject in subjects:
  print "processing " + subject
  pages = 1
  current_page = 1
  while current_page <= pages:
    r = requests.post(
      'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm',
      params={'page': current_page},
      data={'selectedTerm': 'WI15', 
            'selectedSubjects': subject, 
            'schedOption1': True, 
            'schedOption2': True}
    )

    pagesMatch = re.search('Page.*?\(\d*?.*?(\d*?)\)', r.text)
    if (pagesMatch):
      pages = int(pagesMatch.group(1))
    else:
      print "error processing pages. check the code."

    skipTo = 0
    lines = [line for line in r.iter_lines()]
    for i, line in enumerate(lines):
      if skipTo > i:
        continue

      if 'title="Lecture' in line:
        # find course number
        course_i = i
        course_match = None
        while course_match == None:
          if len(lines) == course_i:
            break
          course_match = re.search('<td\s*?class="crsheader">(.*?)</td>', lines[course_i])
          course_i -= 1

        if course_match == None:
          continue
        course = course_match.group(1)

        # find teacher
        teacher_i = i
        teacher_match = None
        while teacher_match == None:
          if len(lines) == teacher_i:
            break
          teacher_match = re.search("<a href='mailto.*?>(.*?)</a>", lines[teacher_i])
          teacher_i += 1

        if teacher_match == None:
          continue
        teacher = teacher_match.group(1).strip()

        # find final
        final_i = i
        start_matching_final = False
        while start_matching_final == False:
          if len(lines) == final_i:
            break
          if 'title="Final"' in lines[final_i]:
            start_matching_final = True
          final_i += 1

        if start_matching_final == True:
          # parse due_date
          due_date_match = re.search('>(.*?)</td>', lines[final_i])
          if due_date_match == None:
            print "idk what's happening... skipping"
            skipTo = final_i
            continue
          due_date = due_date_match.group(1)

          # find due_time
          due_time_i = final_i
          due_time_match = None
          while due_time_match == None:
            due_time_match = re.search(">(.*?)-", lines[due_time_i])
            due_time_i += 1

          due_time = due_time_match.group(1) + 'm'

          skipTo = final_i

        course = {
          'name': subject.strip() + course_match.group(1).strip(),
          'instructor': teacher_match.group(1).strip()
        }

        courses.append(course)

        if (start_matching_final == True):
          task = newTask();
          task['due_date'] = due_date.strip()
          task['due_time'] = due_time.strip()
          task['class_name'] = course['name']
          task['class_instructor'] = course['instructor']

          tasks.append(task)

    print "processed page " + str(current_page)
    current_page += 1

  print "done processing " + subject


f = open('final_classes.json', 'w')
f.write(json.dumps(courses, sort_keys=True, indent=4, separators=(',', ': ')))
f.close()

f = open('final_tasks.json', 'w')
f.write(json.dumps(tasks, sort_keys=True, indent=4, separators=(',', ': ')))
f.close()
