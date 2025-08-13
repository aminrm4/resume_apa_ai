from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to your JSON data file
JSON_FILE = 'data/resume.json'

def load_data():
    """Load data from JSON file"""
    try:
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Data file not found"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON format"}

def save_data(data):
    """Save data to JSON file"""
    try:
        with open(JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving data: {e}")
        return False

@app.route('/api/db', methods=['GET'])
def get_all_data():
    """Get all resume data"""
    return jsonify(load_data())

@app.route('/api/personal', methods=['GET', 'PUT', 'PATCH'])
def manage_personal():
    """Manage personal information"""
    if request.method == 'GET':
        data = load_data()
        return jsonify(data.get('personal', {}))
    
    elif request.method in ['PUT', 'PATCH']:
        data = load_data()
        if 'error' in data:
            return jsonify(data), 400
        
        update_data = request.get_json()
        if not update_data:
            return jsonify({"error": "No data provided"}), 400
        
        if request.method == 'PUT':
            # Replace entire personal section
            data['personal'] = update_data
        else:
            # Update specific fields (PATCH)
            data['personal'].update(update_data)
        
        if save_data(data):
            return jsonify({"message": "Personal info updated successfully", "data": data['personal']})
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/skills', methods=['GET', 'POST'])
def manage_skills():
    """Manage skills list"""
    data = load_data()
    if 'error' in data:
        return jsonify(data), 400
    
    if request.method == 'GET':
        return jsonify(data.get('skills', []))
    
    elif request.method == 'POST':
        new_skill = request.get_json()
        if not new_skill or 'name' not in new_skill or 'level' not in new_skill:
            return jsonify({"error": "Skill must have name and level"}), 400
        
        # Generate unique ID
        skills = data.get('skills', [])
        new_skill['id'] = max([s.get('id', 0) for s in skills], default=0) + 1
        
        skills.append(new_skill)
        data['skills'] = skills
        
        if save_data(data):
            return jsonify({"message": "Skill added successfully", "skill": new_skill}), 201
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/skills/<int:skill_id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
def manage_skill(skill_id):
    """Manage individual skill by ID"""
    data = load_data()
    if 'error' in data:
        return jsonify(data), 400
    
    skills = data.get('skills', [])
    skill = next((s for s in skills if s.get('id') == skill_id), None)
    
    if not skill:
        return jsonify({"error": "Skill not found"}), 404
    
    if request.method == 'GET':
        return jsonify(skill)
    
    elif request.method == 'DELETE':
        skills.remove(skill)
        data['skills'] = skills
        if save_data(data):
            return jsonify({"message": "Skill deleted successfully"})
        else:
            return jsonify({"error": "Failed to save data"}), 500
    
    elif request.method in ['PUT', 'PATCH']:
        update_data = request.get_json()
        if not update_data:
            return jsonify({"error": "No data provided"}), 400
        
        if request.method == 'PUT':
            # Replace entire skill
            skill.update(update_data)
        else:
            # Update specific fields
            skill.update(update_data)
        
        if save_data(data):
            return jsonify({"message": "Skill updated successfully", "skill": skill})
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/education', methods=['GET', 'POST'])
def manage_education():
    """Manage education list"""
    data = load_data()
    if 'error' in data:
        return jsonify(data), 400
    
    if request.method == 'GET':
        return jsonify(data.get('education', []))
    
    elif request.method == 'POST':
        new_edu = request.get_json()
        if not new_edu or 'institution' not in new_edu or 'degree' not in new_edu:
            return jsonify({"error": "Education must have institution and degree"}), 400
        
        # Generate unique ID
        education = data.get('education', [])
        new_edu['id'] = max([e.get('id', 0) for e in education], default=0) + 1
        
        education.append(new_edu)
        data['education'] = education
        
        if save_data(data):
            return jsonify({"message": "Education added successfully", "education": new_edu}), 201
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/education/<int:edu_id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
def manage_education_item(edu_id):
    """Manage individual education item by ID"""
    data = load_data()
    if 'error' in data:
        return jsonify(data), 400
    
    education = data.get('education', [])
    edu_item = next((e for e in education if e.get('id') == edu_id), None)
    
    if not edu_item:
        return jsonify({"error": "Education item not found"}), 404
    
    if request.method == 'GET':
        return jsonify(edu_item)
    
    elif request.method == 'DELETE':
        education.remove(edu_item)
        data['education'] = education
        if save_data(data):
            return jsonify({"message": "Education item deleted successfully"})
        else:
            return jsonify({"error": "Failed to save data"}), 500
    
    elif request.method in ['PUT', 'PATCH']:
        update_data = request.get_json()
        if not update_data:
            return jsonify({"error": "No data provided"}), 400
        
        if request.method == 'PUT':
            edu_item.update(update_data)
        else:
            edu_item.update(update_data)
        
        if save_data(data):
            return jsonify({"message": "Education item updated successfully", "education": edu_item})
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/experience', methods=['GET', 'POST'])
def manage_experience():
    """Manage experience/projects list"""
    data = load_data()
    if 'error' in data:
        return jsonify(data), 400
    
    if request.method == 'GET':
        return jsonify(data.get('experience', []))
    
    elif request.method == 'POST':
        new_exp = request.get_json()
        if not new_exp or ('company' not in new_exp and 'project' not in new_exp):
            return jsonify({"error": "Experience must have company or project"}), 400
        
        # Generate unique ID
        experience = data.get('experience', [])
        new_exp['id'] = max([e.get('id', 0) for e in experience], default=0) + 1
        
        experience.append(new_exp)
        data['experience'] = experience
        
        if save_data(data):
            return jsonify({"message": "Experience added successfully", "experience": new_exp}), 201
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/experience/<int:exp_id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
def manage_experience_item(exp_id):
    """Manage individual experience item by ID"""
    data = load_data()
    if 'error' in data:
        return jsonify(data), 400
    
    experience = data.get('experience', [])
    exp_item = next((e for e in experience if e.get('id') == exp_id), None)
    
    if not exp_item:
        return jsonify({"error": "Experience item not found"}), 404
    
    if request.method == 'GET':
        return jsonify(exp_item)
    
    elif request.method == 'DELETE':
        experience.remove(exp_item)
        data['experience'] = experience
        if save_data(data):
            return jsonify({"message": "Experience item deleted successfully"})
        else:
            return jsonify({"error": "Failed to save data"}), 500
    
    elif request.method in ['PUT', 'PATCH']:
        update_data = request.get_json()
        if not update_data:
            return jsonify({"error": "No data provided"}), 400
        
        if request.method == 'PUT':
            exp_item.update(update_data)
        else:
            exp_item.update(update_data)
        
        if save_data(data):
            return jsonify({"message": "Experience item updated successfully", "experience": exp_item})
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/achievements', methods=['GET', 'POST'])
def manage_achievements():
    """Manage achievements list"""
    data = load_data()
    if 'error' in data:
        return jsonify(data), 400
    
    if request.method == 'GET':
        return jsonify(data.get('achievements', []))
    
    elif request.method == 'POST':
        new_achievement = request.get_json()
        if not new_achievement or 'title' not in new_achievement:
            return jsonify({"error": "Achievement must have title"}), 400
        
        # Generate unique ID
        achievements = data.get('achievements', [])
        new_achievement['id'] = max([a.get('id', 0) for a in achievements], default=0) + 1
        
        achievements.append(new_achievement)
        data['achievements'] = achievements
        
        if save_data(data):
            return jsonify({"message": "Achievement added successfully", "achievement": new_achievement}), 201
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/achievements/<int:achievement_id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
def manage_achievement_item(achievement_id):
    """Manage individual achievement by ID"""
    data = load_data()
    if 'error' in data:
        return jsonify(data), 400
    
    achievements = data.get('achievements', [])
    achievement = next((a for a in achievements if a.get('id') == achievement_id), None)
    
    if not achievement:
        return jsonify({"error": "Achievement not found"}), 404
    
    if request.method == 'GET':
        return jsonify(achievement)
    
    elif request.method == 'DELETE':
        achievements.remove(achievement)
        data['achievements'] = achievements
        if save_data(data):
            return jsonify({"message": "Achievement deleted successfully"})
        else:
            return jsonify({"error": "Failed to save data"}), 500
    
    elif request.method in ['PUT', 'PATCH']:
        update_data = request.get_json()
        if not update_data:
            return jsonify({"error": "No data provided"}), 400
        
        if request.method == 'PUT':
            achievement.update(update_data)
        else:
            achievement.update(update_data)
        
        if save_data(data):
            return jsonify({"message": "Achievement updated successfully", "achievement": achievement})
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/interests', methods=['GET', 'POST', 'PUT'])
def manage_interests():
    """Manage interests list"""
    data = load_data()
    if 'error' in data:
        return jsonify(data), 400
    
    if request.method == 'GET':
        return jsonify(data.get('interests', []))
    
    elif request.method == 'POST':
        new_interest = request.get_json()
        if not new_interest or 'name' not in new_interest:
            return jsonify({"error": "Interest must have name"}), 400
        
        interests = data.get('interests', [])
        if new_interest['name'] not in interests:
            interests.append(new_interest['name'])
            data['interests'] = interests
            
            if save_data(data):
                return jsonify({"message": "Interest added successfully", "interests": interests}), 201
            else:
                return jsonify({"error": "Failed to save data"}), 500
        else:
            return jsonify({"error": "Interest already exists"}), 400
    
    elif request.method == 'PUT':
        new_interests = request.get_json()
        if not new_interests or not isinstance(new_interests, list):
            return jsonify({"error": "Interests must be a list"}), 400
        
        data['interests'] = new_interests
        if save_data(data):
            return jsonify({"message": "Interests updated successfully", "interests": new_interests})
        else:
            return jsonify({"error": "Failed to save data"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    print("🚀 Flask Resume API Server Starting...")
    print("📁 Data file:", JSON_FILE)
    print("🌐 Server will run on: http://localhost:5000")
    print("📚 Available endpoints:")
    print("   GET  /api/db - Get all data")
    print("   GET  /api/personal - Get personal info")
    print("   PUT  /api/personal - Update personal info")
    print("   GET  /api/skills - Get skills")
    print("   POST /api/skills - Add new skill")
    print("   PUT  /api/skills/:id - Update skill")
    print("   DEL  /api/skills/:id - Delete skill")
    print("   ... and more for education, experience, achievements, interests")
    print("\n💡 Use the test.html file to test the API!")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 