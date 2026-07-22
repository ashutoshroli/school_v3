/**
 * Role-Based Access Control Middleware
 * 
 * Role Hierarchy:
 * super_admin - Full access, can delete anything
 * admin/director - Create/Edit everything, soft-delete only
 * principal/vp - Scoped to own branch, full control within branch
 * staff/teacher - Scoped to own class/subject/cabin
 * parent/student - Scoped to own data
 */

const ROLES = {
  super_admin: 100,
  admin: 90,
  director: 85,
  principal: 70,
  vp: 65,
  staff: 50,
  teacher: 50,
  parent: 20,
  student: 10,
  accountant: 45,
  librarian: 45,
  transport_manager: 45,
  warden: 45,
  mess_incharge: 45,
  lab_assistant: 40,
  front_office: 40,
  exam_dept: 45
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super Admin bypass
    if (user.isSuperAdmin || user.bypass_all_permissions) {
      return next();
    }

    const userLevel = ROLES[user.user_role] || 0;
    const minRequiredLevel = Math.min(...allowedRoles.map(r => ROLES[r] || 0));

    if (userLevel >= minRequiredLevel) {
      return next();
    }

    return res.status(403).json({ 
      error: 'Insufficient permissions',
      required: allowedRoles,
      current: user.user_role
    });
  };
};

const requireBranchAccess = (req, res, next) => {
  const user = req.user;
  const branchId = req.params.branchId || req.body.branchId || req.query.branchId;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Super Admin has access to all branches
  if (user.isSuperAdmin || user.bypass_all_permissions) {
    return next();
  }

  // Admin/Director has access to all branches
  if (['admin', 'director'].includes(user.user_role)) {
    return next();
  }

  // Check if user has access to this specific branch
  if (branchId && user.branchAccess) {
    const hasAccess = user.branchAccess.some(b => b.branch_id === branchId);
    if (hasAccess) {
      return next();
    }
  }

  // Check primary branch
  if (branchId && user.primary_branch_id === branchId) {
    return next();
  }

  return res.status(403).json({ error: 'Access denied to this branch' });
};

const requireBranchAdmin = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Super Admin and Admin bypass
  if (user.isSuperAdmin || ['admin', 'director'].includes(user.user_role)) {
    return next();
  }

  // Principal/VP can manage their branch
  if (['principal', 'vp'].includes(user.user_role)) {
    return next();
  }

  return res.status(403).json({ 
    error: 'Branch admin access required',
    current: user.user_role
  });
};

const canDelete = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Only Super Admin can delete
  if (user.isSuperAdmin || user.bypass_all_permissions) {
    return next();
  }

  return res.status(403).json({ 
    error: 'Only Super Admin can delete records',
    hint: 'Use soft-delete (archive) instead'
  });
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super Admin bypass
    if (user.isSuperAdmin || user.bypass_all_permissions) {
      return next();
    }

    // Check custom permissions if available
    if (user.permissions && user.permissions.includes(permission)) {
      return next();
    }

    // Check branch-specific permissions
    const branchId = req.params.branchId || req.body.branchId || req.query.branchId;
    if (branchId && user.branchAccess) {
      const branchAccess = user.branchAccess.find(b => b.branch_id === branchId);
      if (branchAccess && branchAccess.custom_permissions && 
          branchAccess.custom_permissions[permission]) {
        return next();
      }
    }

    return res.status(403).json({ 
      error: 'Permission denied',
      required: permission
    });
  };
};

module.exports = {
  requireRole,
  requireBranchAccess,
  requireBranchAdmin,
  canDelete,
  checkPermission,
  ROLES
};
