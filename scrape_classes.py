import string
import requests
import json
from lxml import html

PAGES = 150
BASE_URL = "http://asucsd.ucsd.edu/gradeDistribution/index/ajax/gradedistribution-grid/GradeDistribution_page/"

classes = set()

for i in range(1, PAGES + 1):
  url = BASE_URL + str(i)
  page = requests.get(url)
  tree = html.fromstring(page.text)

  for row_num in range(1, 100 + 1):
    subject = tree.xpath('//*[@id="gradedistribution-grid"]/table/tbody/tr[' + str(row_num) + ']/td[' + str(2) + ']/text()')
    course = tree.xpath('//*[@id="gradedistribution-grid"]/table/tbody/tr[' + str(row_num) + ']/td[' + str(3) + ']/text()')
    if len(subject) == 0 or len(course) == 0:
      continue

    classes.add(subject[0].strip() + course[0].strip())

  print "Processed page " + str(i)

f = open('classes.json', 'w')
classes = map(lambda c: { 'name': c }, classes)
f.write(json.dumps(list(classes), sort_keys=True, indent=4, separators=(',', ': ')))
f.close()
