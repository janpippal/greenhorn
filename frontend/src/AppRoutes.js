import React from "react";
import { Switch, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { PageNotFound } from "./components/PageNotFound";
import { PrivateRoute } from "./components/PrivateRoute";
import { TasksPage } from "./components/TasksPage";
import { TaskForm } from "./components/TaskForm";
import { TaskEditForm } from "./components/TaskEditForm";
import { PeoplePage } from "./components/PeoplePage";
import { PersonForm } from "./components/PersonForm";
import { PersonEditForm } from "./components/PersonsEditForm";
import { TemplatesPage } from "./components/TemplatesPage";
import { TemplateForm } from "./components/TemplateForm";
import { AssignTemplatePage } from "./components/AssignTemplatePage";
import { SetPasswordPage } from './components/SetPasswordPage';
import { DashboardPage } from "./components/DashboardPage";


export const AppRoutes = () => (
  <Switch>
    <Route path="/" exact component={LoginPage} />
    <PrivateRoute path="/dashboard" exact component={DashboardPage} />
    <PrivateRoute path="/tasks" exact component={TasksPage} />
    <PrivateRoute path="/tasks/add" exact component={TaskForm} />
    <PrivateRoute path="/tasks/edit/:task_id" exact component={TaskEditForm} />
    <PrivateRoute path="/people" exact component={PeoplePage} />
    <PrivateRoute path="/people/add" exact component={PersonForm} />
    <PrivateRoute path="/people/edit/:person_id" exact component={PersonEditForm} />
    <PrivateRoute path="/templates" exact component={TemplatesPage} />
    <PrivateRoute path="/templates/add" exact component={TemplateForm} />
    <PrivateRoute path="/templates/assign" exact component={AssignTemplatePage} />
    <Route path="/setPassword/:token" exact component={SetPasswordPage}/>
    <Route path="*" component={PageNotFound} />
  </Switch>
);
