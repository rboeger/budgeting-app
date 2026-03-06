from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from models import db, User, Category, Expense, Paycheck, CreditCard
import os
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)
CORS(app)

# Create tables
with app.app_context():
    db.create_all()

# ============== Authentication Routes ==============

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'User created successfully',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200


# ============== Categories Routes ==============

@app.route('/api/categories', methods=['GET'])
@jwt_required()
def get_categories():
    user_id = int(get_jwt_identity())
    categories = Category.query.filter_by(user_id=user_id).order_by(Category.created_at.desc()).all()
    return jsonify([cat.to_dict() for cat in categories]), 200


@app.route('/api/categories', methods=['POST'])
@jwt_required()
def create_category():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('color'):
        return jsonify({'error': 'Name and color are required'}), 400
    
    category = Category(user_id=user_id, name=data['name'], color=data['color'])
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201


@app.route('/api/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(id=category_id, user_id=user_id).first()
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    data = request.get_json()
    category.name = data.get('name', category.name)
    category.color = data.get('color', category.color)
    
    db.session.commit()
    return jsonify(category.to_dict()), 200


@app.route('/api/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(id=category_id, user_id=user_id).first()
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'success': True}), 200


# ============== Expenses Routes ==============

@app.route('/api/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = int(get_jwt_identity())
    expenses = Expense.query.filter_by(user_id=user_id).order_by(Expense.created_at.desc()).all()
    return jsonify([exp.to_dict() for exp in expenses]), 200


@app.route('/api/expenses', methods=['POST'])
@jwt_required()
def create_expense():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not data.get('categoryId') or not data.get('name') or not data.get('amount') or not data.get('frequency'):
        return jsonify({'error': 'All fields are required'}), 400
    
    # Verify category belongs to user
    category = Category.query.filter_by(id=data['categoryId'], user_id=user_id).first()
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    expense = Expense(
        user_id=user_id,
        category_id=data['categoryId'],
        name=data['name'],
        amount=float(data['amount']),
        frequency=data['frequency']
    )
    
    db.session.add(expense)
    db.session.commit()
    
    return jsonify(expense.to_dict()), 201


@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
    
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    
    data = request.get_json()
    
    # Verify category belongs to user
    if data.get('categoryId'):
        category = Category.query.filter_by(id=data['categoryId'], user_id=user_id).first()
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        expense.category_id = data['categoryId']
    
    expense.name = data.get('name', expense.name)
    expense.amount = float(data.get('amount', expense.amount))
    expense.frequency = data.get('frequency', expense.frequency)
    
    db.session.commit()
    return jsonify(expense.to_dict()), 200


@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
    
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404
    
    db.session.delete(expense)
    db.session.commit()
    
    return jsonify({'success': True}), 200


# ============== Paychecks Routes ==============

@app.route('/api/paychecks', methods=['GET'])
@jwt_required()
def get_paychecks():
    user_id = int(get_jwt_identity())
    paychecks = Paycheck.query.filter_by(user_id=user_id).order_by(Paycheck.created_at.desc()).all()
    return jsonify([pc.to_dict() for pc in paychecks]), 200


@app.route('/api/paychecks', methods=['POST'])
@jwt_required()
def create_paycheck():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not data.get('amount') or not data.get('frequency'):
        return jsonify({'error': 'Amount and frequency are required'}), 400
    
    paycheck = Paycheck(
        user_id=user_id,
        amount=float(data['amount']),
        frequency=data['frequency']
    )
    
    db.session.add(paycheck)
    db.session.commit()
    
    return jsonify(paycheck.to_dict()), 201


@app.route('/api/paychecks/<int:paycheck_id>', methods=['DELETE'])
@jwt_required()
def delete_paycheck(paycheck_id):
    user_id = int(get_jwt_identity())
    paycheck = Paycheck.query.filter_by(id=paycheck_id, user_id=user_id).first()
    
    if not paycheck:
        return jsonify({'error': 'Paycheck not found'}), 404
    
    db.session.delete(paycheck)
    db.session.commit()
    
    return jsonify({'success': True}), 200


# ============== Credit Cards Routes ==============

@app.route('/api/credit-cards', methods=['GET'])
@jwt_required()
def get_credit_cards():
    user_id = int(get_jwt_identity())
    cards = CreditCard.query.filter_by(user_id=user_id).order_by(CreditCard.created_at.desc()).all()
    return jsonify([card.to_dict() for card in cards]), 200


@app.route('/api/credit-cards', methods=['POST'])
@jwt_required()
def create_credit_card():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not data.get('name') or data.get('balance') is None or data.get('interestRate') is None or not data.get('payoffDate'):
        return jsonify({'error': 'All fields are required'}), 400
    
    card = CreditCard(
        user_id=user_id,
        name=data['name'],
        balance=float(data['balance']),
        interest_rate=float(data['interestRate']),
        payoff_date=data['payoffDate']
    )
    
    db.session.add(card)
    db.session.commit()
    
    return jsonify(card.to_dict()), 201


@app.route('/api/credit-cards/<int:card_id>', methods=['PUT'])
@jwt_required()
def update_credit_card(card_id):
    user_id = int(get_jwt_identity())
    card = CreditCard.query.filter_by(id=card_id, user_id=user_id).first()
    
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    
    data = request.get_json()
    card.name = data.get('name', card.name)
    card.balance = float(data.get('balance', card.balance))
    card.interest_rate = float(data.get('interestRate', card.interest_rate))
    card.payoff_date = data.get('payoffDate', card.payoff_date)
    
    db.session.commit()
    return jsonify(card.to_dict()), 200


@app.route('/api/credit-cards/<int:card_id>', methods=['DELETE'])
@jwt_required()
def delete_credit_card(card_id):
    user_id = int(get_jwt_identity())
    card = CreditCard.query.filter_by(id=card_id, user_id=user_id).first()
    
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    
    db.session.delete(card)
    db.session.commit()
    
    return jsonify({'success': True}), 200


# ============== Frontend Static Files ==============

@app.route('/')
def serve_react_root():
    """Serve the main React app"""
    static_folder = os.path.join(os.path.dirname(__file__), 'static')
    return send_from_directory(static_folder, 'index.html')


@app.route('/<path:path>')
def serve_react_files(path):
    """Serve React static files, fallback to index.html for SPA routing"""
    static_folder = os.path.join(os.path.dirname(__file__), 'static')
    
    # Check if file exists in static folder
    if os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    
    # For any non-existent routes, serve index.html (React router will handle)
    return send_from_directory(static_folder, 'index.html')


# ============== Health Check ==============

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200


# ============== Error Handlers ==============

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Route not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
