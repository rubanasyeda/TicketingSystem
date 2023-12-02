"""
Make sure to run this test file on new virtual env please
"""

import unittest
from urllib.parse import urlparse
from flask import Flask
from werkzeug.security import generate_password_hash
from flask_testing import TestCase
from .website import create_app, db
from .website.models import User


class Testing(TestCase):
    def create_app(self):
        app = create_app()
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_login_success(self):
        user = User(username="test", password=generate_password_hash("test", method='sha256'))
        db.session.add(user)
        db.session.commit()

        response = self.client.post('/login', data={'username': 'test', 'password': 'test'})
        expected_url = '/dashboard'
        actual_url = urlparse(response.headers['Location']).path
        self.assertEqual(actual_url, expected_url)

    def test_login_failure(self):
        response = self.client.post('/login', data={'username': 'none', 'password': 'none'})
        expected_url = '/login'
        actual_url = urlparse(response.headers['Location']).path
        self.assertEqual(actual_url, expected_url)

    def test_admin_access_signup(self):
        admin_user = User(username="admin", password=generate_password_hash("admin", method='sha256'), role="admin")
        db.session.add(admin_user)
        db.session.commit()

        self.client.post('/login', data={'username': 'admin', 'password': 'admin'})
        response = self.client.get('/signup')
        self.assertEqual(response.status_code, 200)

    def test_admin_can_create_account_for_worker(self):
        admin_user = User(username="adminuser", password=generate_password_hash("adminpassword", method='sha256'),
                          role="admin")
        db.session.add(admin_user)
        db.session.commit()
        self.client.post('/login', data={'username': 'adminuser', 'password': 'adminpassword'})
        response = self.client.post('/signup', data={'name': 'Test Worker', 'username': 'testworker',
                                                     'password': 'testpassword', 'role': 'worker'})
        expected_url = '/login'
        actual_url = urlparse(response.headers['Location']).path
        self.assertEqual(actual_url, expected_url)
        worker_user = User.query.filter_by(username='testworker').first()
        self.assertIsNotNone(worker_user)
        self.assertEqual(worker_user.name, 'Test Worker')
        self.assertEqual(worker_user.role, 'worker')

    def test_delete_user(self):
        user = User(name="Test User", username="testuser", role="worker")
        db.session.add(user)
        db.session.commit()
        response = self.client.delete(f'/deleteUser/{user.id}')
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "User deleted successfully")
        deleted_user = User.query.filter_by(id=user.id).first()
        self.assertIsNone(deleted_user)

    def test_delete_nonexistent_user(self):
        response = self.client.delete('/deleteUser/123')
        self.assertEqual(response.json[1], 404)

    def test_admin_can_access_admin_page(self):
        admin_user = User(username="admin", password=generate_password_hash("admin", method='sha256'), role="admin")
        db.session.add(admin_user)
        db.session.commit()

        response = self.client.post('/login', data={'username': 'admin', 'password': 'admin'})

        response = self.client.get('/admin-dashboard')
        self.assertEqual(response.status_code, 200)

    def test_non_admin_cannot_access_admin_page(self):
        non_admin_user = User(username="nonadmin", password=generate_password_hash("nonadmin", method='sha256'),
                              role="worker")
        db.session.add(non_admin_user)
        db.session.commit()
        response = self.client.post('/login', data={'username': 'nonadmin', 'password': 'nonadmin'})
        response = self.client.get('/admin-dashboard')
        self.assertEqual(response.status_code, 302)


if __name__ == '__main__':
    unittest.main()
