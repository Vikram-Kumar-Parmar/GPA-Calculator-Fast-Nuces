  // Data storage
        let courses = [];
        let semesters = [];
        let analysisCourses = [];
        let courseCounter = 0;
        let semesterCounter = 0;
        let analysisCounter = 0;

        // Grade to GPA mapping
        const gpaToGrade = { '0.00': 'F', '1.00': 'D', '1.33': 'D+', '1.67': 'C-', '2.00': 'C', '2.33': 'C+', '2.67': 'B-', '3.00': 'B', '3.33': 'B+', '3.67': 'A-', '4.00': 'A/A+' };

        // Tab switching
        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(`${tab}-section`).classList.add('active');
        }

        // SGPA Functions
        function addCourse() {
            const title = document.getElementById('courseTitle').value.trim();
            const credits = parseInt(document.getElementById('creditHours').value);
            const gpa = parseFloat(document.getElementById('grade').value);
            if (!title || !credits || isNaN(gpa)) { alert('Please fill all fields!'); return; }
            const course = { id: ++courseCounter, title: title, credits: credits, gpa: gpa, gradePoints: credits * gpa, grade: gpaToGrade[gpa.toFixed(2)] };
            courses.push(course);
            updateCoursesTable();
            updateTotals();
            clearCourseForm();
        }

        function deleteCourse(id) {
            courses = courses.filter(course => course.id !== id);
            updateCoursesTable();
            updateTotals();
            document.getElementById('sgpaResult').classList.remove('show');
        }
        
        function updateTotals() {
            const totalCourses = courses.length;
            const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
            const totalGradePoints = courses.reduce((sum, course) => sum + course.gradePoints, 0);
            document.getElementById('totalCourses').textContent = totalCourses;
            document.getElementById('totalCredits').textContent = totalCredits;
            document.getElementById('totalGradePoints').textContent = totalGradePoints.toFixed(2);
        }

        function updateCoursesTable() {
            const tbody = document.getElementById('coursesTable');
            if (courses.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No courses added yet.</td></tr>`;
                return;
            }
            tbody.innerHTML = courses.map((course, index) => `
                <tr class="table-row">
                    <td>${index + 1}</td>
                    <td><input type="text" class="editable-field" style="background-color:#000; color:#fff;" value="${course.title}" onchange="updateCourseField(${course.id}, 'title', this.value)"></td>
                    <td><select class="editable-field" onchange="updateCourseField(${course.id}, 'credits', this.value)">
                        <option value="1" ${course.credits === 1 ? 'selected' : ''}>1</option>
                        <option value="2" ${course.credits === 2 ? 'selected' : ''}>2</option>
                        <option value="3" ${course.credits === 3 ? 'selected' : ''}>3</option>
                    </select></td>
                    <td>${course.grade}</td>
                    <td><select class="editable-field" onchange="updateCourseField(${course.id}, 'gpa', this.value)">
                        ${Object.keys(gpaToGrade).reverse().map(gpa => `<option value="${gpa}" ${course.gpa.toFixed(2) === gpa ? 'selected' : ''}>${gpa}</option>`).join('')}
                    </select></td>
                    <td class="grade-points">${course.gradePoints.toFixed(2)}</td>
                    <td><button class="delete-btn" onclick="deleteCourse(${course.id})">Del</button></td>
                </tr>`).join('');
        }

        function updateCourseField(courseId, field, value) {
            const course = courses.find(c => c.id === courseId);
            if (!course) return;
            if (field === 'title') course.title = value.trim();
            if (field === 'credits') course.credits = parseInt(value);
            if (field === 'gpa') {
                course.gpa = parseFloat(value);
                course.grade = gpaToGrade[course.gpa.toFixed(2)];
            }
            course.gradePoints = course.credits * course.gpa;
            updateCoursesTable();
            updateTotals();
            document.getElementById('sgpaResult').classList.remove('show');
        }

        function calculateSGPA() {
            if (courses.length === 0) {
                alert("Please add at least one course to calculate SGPA.");
                return;
            }
            const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
            const totalGradePoints = courses.reduce((sum, course) => sum + course.gradePoints, 0);
            const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
            
            document.getElementById('sgpaValue').textContent = sgpa.toFixed(2);
            document.getElementById('sgpaResult').classList.add('show');
            checkGPAStatus(sgpa, 'SGPA');
        }

        function clearCourseForm() {
            document.getElementById('courseTitle').value = '';
            document.getElementById('creditHours').value = '';
            document.getElementById('grade').value = '';
        }

        // CGPA Functions
        function addSemester() {
            const name = document.getElementById('semesterName').value.trim();
            const sgpa = parseFloat(document.getElementById('semesterSGPA').value);
            const credits = parseInt(document.getElementById('semesterCredits').value);
            if (!name || isNaN(sgpa) || !credits || sgpa < 0 || sgpa > 4) { alert('Please fill all fields correctly!'); return; }
            const semester = { id: ++semesterCounter, name: name, sgpa: sgpa, credits: credits, gradePoints: sgpa * credits };
            semesters.push(semester);
            updateSemestersTable();
            updateSemesterTotals();
            clearSemesterForm();
        }

        function deleteSemester(id) {
            semesters = semesters.filter(semester => semester.id !== id);
            updateSemestersTable();
            updateSemesterTotals();
            document.getElementById('cgpaResult').classList.remove('show');
        }
        
        function updateSemesterTotals() {
            const totalSemesters = semesters.length;
            const totalCredits = semesters.reduce((sum, s) => sum + s.credits, 0);
            const totalGradePoints = semesters.reduce((sum, s) => sum + s.gradePoints, 0);
            document.getElementById('totalSemesters').textContent = totalSemesters;
            document.getElementById('totalAllCredits').textContent = totalCredits;
            document.getElementById('totalAllGradePoints').textContent = totalGradePoints.toFixed(2);
        }

        function updateSemestersTable() {
            const tbody = document.getElementById('semestersTable');
            if (semesters.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No semesters added yet.</td></tr>`;
                return;
            }
            tbody.innerHTML = semesters.map((semester, index) => `
                <tr class="table-row">
                    <td>${index + 1}</td>
                    <td>${semester.name}</td>
                    <td>${semester.sgpa.toFixed(2)}</td>
                    <td>${semester.credits}</td>
                    <td class="grade-points">${semester.gradePoints.toFixed(2)}</td>
                    <td><button class="delete-btn" onclick="deleteSemester(${semester.id})">Del</button></td>
                </tr>`).join('');
        }

        function calculateCGPA() {
            if (semesters.length === 0) {
                alert("Please add at least one semester to calculate CGPA.");
                return;
            }
            const totalCredits = semesters.reduce((sum, s) => sum + s.credits, 0);
            const totalGradePoints = semesters.reduce((sum, s) => sum + s.gradePoints, 0);
            const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
            
            document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);
            document.getElementById('cgpaResult').classList.add('show');
            checkGPAStatus(cgpa, 'CGPA');
        }

        function clearSemesterForm() {
            document.getElementById('semesterName').value = '';
            document.getElementById('semesterSGPA').value = '';
            document.getElementById('semesterCredits').value = '';
        }

        // Popup & Analysis Functions
        function checkGPAStatus(gpa, type) {
            if (gpa > 0) {
                if (gpa < 2.00) showWarningPopup(type, gpa);
                else if (gpa >= 3.5) showSuccessPopup(type, gpa);
            }
        }
        function showWarningPopup(type, gpa) {
            document.getElementById('warningMessage').textContent = `Jani your ${type} is ${gpa.toFixed(2)}, which is below 2.00. kuch kar warna uni wale jeene nai deenge sachi ! 🥲`;
            document.getElementById('warningPopup').classList.add('show');
        }
        function showSuccessPopup(type, gpa) {
            document.getElementById('successMessage').textContent = `Excellent! theete your ${type} is ${gpa.toFixed(2)}. tum to Dean's List man ho, maze hi mazeee !! 🥳😂`;
            document.getElementById('successPopup').classList.add('show');
        }
        function closePopup() { document.getElementById('warningPopup').classList.remove('show'); }
        function closeSuccessPopup() { document.getElementById('successPopup').classList.remove('show'); }

        function openAnalysisWindow() {
            closePopup();
            document.getElementById('analysisWindow').classList.add('show');
        }
        function closeAnalysisWindow() {
            document.getElementById('analysisWindow').classList.remove('show');
            analysisCourses = [];
            analysisCounter = 0;
            updateAnalysisTable();
            document.getElementById('analysisResults').style.display = 'none';
        }

        function addAnalysisCourse() {
            const name = document.getElementById('analysisCourseName').value.trim();
            const credits = parseInt(document.getElementById('analysisCreditHours').value);
            if (!name || !credits) { alert('Please fill all fields!'); return; }
            analysisCourses.push({ id: ++analysisCounter, name: name, credits: credits });
            updateAnalysisTable();
            document.getElementById('analysisCourseName').value = '';
            document.getElementById('analysisCreditHours').value = '';
        }

        function deleteAnalysisCourse(id) {
            analysisCourses = analysisCourses.filter(c => c.id !== id);
            updateAnalysisTable();
        }

        function updateAnalysisTable() {
            const tbody = document.getElementById('analysisCoursesTable');
            if (analysisCourses.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Add courses to analyze!</td></tr>`;
                return;
            }
            tbody.innerHTML = analysisCourses.map((course, index) => `
                <tr class="table-row">
                    <td>${index + 1}</td>
                    <td>${course.name}</td>
                    <td>${course.credits}</td>
                    <td><button class="delete-btn" onclick="deleteAnalysisCourse(${course.id})">Del</button></td>
                </tr>`).join('');
        }

        function analyzeGrades() {
            const currentTotalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
            const currentTotalPoints = courses.reduce((sum, course) => sum + course.gradePoints, 0);
            const analysisTotalCredits = analysisCourses.reduce((sum, course) => sum + course.credits, 0);

            if (analysisTotalCredits === 0) {
                alert("Please add courses to the analysis table first.");
                return;
            }
            
            const resultsDiv = document.getElementById('analysisResults');
            const outputDiv = document.getElementById('analysisOutput');
            let outputHTML = '<ul>';

            const targets = [2.00, 2.50, 3.00, 3.50];
            targets.forEach(targetGPA => {
                const requiredTotalPoints = (currentTotalCredits + analysisTotalCredits) * targetGPA;
                const requiredFuturePoints = requiredTotalPoints - currentTotalPoints;
                const requiredFutureGPA = analysisTotalCredits > 0 ? requiredFuturePoints / analysisTotalCredits : 0;
                
                outputHTML += `<li>To achieve a <strong>${targetGPA.toFixed(2)} GPA</strong>, you need to score an average GPA of <strong>${requiredFutureGPA.toFixed(2)}</strong> in your upcoming ${analysisTotalCredits} credits.`;
                
                if (requiredFutureGPA > 4.0) {
                    outputHTML += ` <span style="color: #ef4444;">(This is not possible)</span></li>`;
                } else if (requiredFutureGPA < 0) {
                     outputHTML += ` <span style="color: #81c784;">(Easily achievable)</span></li>`;
                } else {
                    outputHTML += `</li>`;
                }
            });

            outputHTML += '</ul>';
            outputDiv.innerHTML = outputHTML;
            resultsDiv.style.display = 'block';
        }

